import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../common/prisma.service';
import { CloudinaryService } from '../common/cloudinary.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, CloudinaryService],
  exports: [ProductsService],
})
export class ProductsModule {}
