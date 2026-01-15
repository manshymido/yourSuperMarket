import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    PrismaService,
    ProductHelperService,
    InventoryHelperService,
    OwnershipHelperService,
  ],
  exports: [CartService],
})
export class CartModule {}
