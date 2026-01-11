import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { slugify } from './utils';

@Injectable()
export class SlugService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueSlug(
    text: string,
    model: 'product' | 'category',
    excludeId?: string,
  ): Promise<string> {
    const baseSlug = slugify(text);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await this.slugExists(uniqueSlug, model, excludeId)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  private async slugExists(
    slug: string,
    model: 'product' | 'category',
    excludeId?: string,
  ): Promise<boolean> {
    const where = excludeId
      ? { slug, id: { not: excludeId } }
      : { slug };

    if (model === 'product') {
      const result = excludeId
        ? await this.prisma.product.findFirst({ where })
        : await this.prisma.product.findUnique({ where });
      return !!result;
    } else {
      const result = excludeId
        ? await this.prisma.category.findFirst({ where })
        : await this.prisma.category.findUnique({ where });
      return !!result;
    }
  }
}
