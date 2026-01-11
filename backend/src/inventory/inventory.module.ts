import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService, ProductHelperService],
  exports: [InventoryService],
})
export class InventoryModule {}
