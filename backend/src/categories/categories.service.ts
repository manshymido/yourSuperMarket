import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SlugService } from '../common/slug.service';
import { ERROR_MESSAGES } from '../common/error-messages';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const uniqueSlug = await this.slugService.generateUniqueSlug(
      createCategoryDto.name,
      'category',
    );

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug: uniqueSlug,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findAll(includeInactive = false) {
    return this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          take: 10,
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    const data: Partial<UpdateCategoryDto & { slug?: string }> = {
      ...updateCategoryDto,
    };

    // If name is being updated, update slug
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      data.slug = await this.slugService.generateUniqueSlug(
        updateCategoryDto.name,
        'category',
        id,
      );
    }

    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Check if category has products
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new Error('Cannot delete category with products');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
