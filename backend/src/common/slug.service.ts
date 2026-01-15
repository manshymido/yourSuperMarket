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
    if (model === 'product') {
      if (excludeId) {
        const result = await this.prisma.product.findFirst({
          where: { slug, id: { not: excludeId } },
        });
        return !!result;
      } else {
        const result = await this.prisma.product.findUnique({
          where: { slug },
        });
        return !!result;
      }
    } else {
      if (excludeId) {
        const result = await this.prisma.category.findFirst({
          where: { slug, id: { not: excludeId } },
        });
        return !!result;
      } else {
        const result = await this.prisma.category.findUnique({
          where: { slug },
        });
        return !!result;
      }
    }
  }
}
