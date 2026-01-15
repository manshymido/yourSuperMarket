import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    ProductHelperService,
    InventoryHelperService,
    OwnershipHelperService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
