import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CloudinaryService } from '../common/cloudinary.service';
import { slugify } from '../common/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ) {
    const slug = slugify(createProductDto.name);

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (
      await this.prisma.product.findUnique({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

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

    const skip = (page - 1) * limit;

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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
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
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
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
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const data: Prisma.ProductUpdateInput = { ...updateProductDto };

    // If name is being updated, update slug
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const slug = slugify(updateProductDto.name);
      let uniqueSlug = slug;
      let counter = 1;
      while (
        await this.prisma.product.findFirst({
          where: { slug: uniqueSlug, id: { not: id } },
        })
      ) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      data.slug = uniqueSlug;
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
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

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
