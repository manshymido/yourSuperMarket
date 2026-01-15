import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CloudinaryService } from '../common/cloudinary.service';
import { SlugService } from '../common/slug.service';
import { PaginationService } from '../common/pagination.service';
import { ProductHelperService } from '../common/product-helper.service';
import { USER_PUBLIC_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private slugService: SlugService,
    private paginationService: PaginationService,
    private productHelperService: ProductHelperService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ) {
    const uniqueSlug = await this.slugService.generateUniqueSlug(
      createProductDto.name,
      'product',
    );

    // Upload images if provided
    let imageUrls: string[] = createProductDto.images || [];
    if (files && files.length > 0) {
      const uploadedImages =
        await this.cloudinaryService.uploadMultipleImages(files);
      imageUrls = [...imageUrls, ...uploadedImages];
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug: uniqueSlug,
        images: imageUrls,
      },
      include: {
        category: true,
        inventory: true,
        _count: {
          select: { reviews: true },
        },
      },
    });

    // Create inventory entry
    await this.prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 0,
      },
    });

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      isFeatured,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = this.paginationService.calculateSkip(page, limit);

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          inventory: true,
          _count: {
            select: { reviews: true },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: this.paginationService.calculatePagination(
        page,
        limit,
        total,
      ),
    };
  }

  async findOne(id: string) {
    return this.findProductWithDetails({ id }, 10);
  }

  async findBySlug(slug: string) {
    return this.findProductWithDetails({ slug });
  }

  private async findProductWithDetails(
    where: { id?: string; slug?: string },
    reviewLimit?: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: where.id ? { id: where.id } : { slug: where.slug! },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        inventory: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: USER_PUBLIC_SELECT,
            },
          },
          orderBy: { createdAt: 'desc' },
          ...(reviewLimit && { take: reviewLimit }),
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    const product = await this.productHelperService.validateProductExists(id);

    const data: Prisma.ProductUpdateInput = { ...updateProductDto };

    // If name is being updated, update slug
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      data.slug = await this.slugService.generateUniqueSlug(
        updateProductDto.name,
        'product',
        id,
      );
    }

    // Handle image uploads
    if (files && files.length > 0) {
      const uploadedImages =
        await this.cloudinaryService.uploadMultipleImages(files);
      const existingImages = product.images || [];
      data.images = [...existingImages, ...uploadedImages];
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async remove(id: string) {
    const product = await this.productHelperService.validateProductExists(id);

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(imageUrl);
          await this.cloudinaryService.deleteImage(publicId);
        } catch (error) {
          // Continue even if image deletion fails
          const errorStack = error instanceof Error ? error.stack : undefined;
          this.logger.error(`Failed to delete image: ${imageUrl}`, errorStack);
        }
      }
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}
