import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../common/prisma.service';
import { SlugService } from '../common/slug.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, SlugService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
