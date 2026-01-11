import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../common/prisma.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { SlugService } from '../common/slug.service';
import { PaginationService } from '../common/pagination.service';
import { ProductHelperService } from '../common/product-helper.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    CloudinaryService,
    SlugService,
    PaginationService,
    ProductHelperService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
