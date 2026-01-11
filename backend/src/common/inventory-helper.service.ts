import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Product, Inventory } from '@prisma/client';
import { ERROR_MESSAGES } from './error-messages';

export interface ProductWithInventory extends Product {
  inventory?: Inventory | null;
}

@Injectable()
export class InventoryHelperService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if product has sufficient inventory
   * @param product Product with inventory relation
   * @param requestedQuantity Quantity requested
   * @param productName Optional product name for error messages
   * @throws BadRequestException if insufficient stock
   */
  validateProductStock(
    product: ProductWithInventory,
    requestedQuantity: number,
    productName?: string,
  ): void {
    const availableQuantity = product.inventory?.quantity || 0;
    if (availableQuantity < requestedQuantity) {
      const name = productName || product.name;
      throw new BadRequestException(
        `${ERROR_MESSAGES.INSUFFICIENT_STOCK} for ${name}. Available: ${availableQuantity}`,
      );
    }
  }

  /**
   * Get available quantity for a product
   */
  getAvailableQuantity(product: ProductWithInventory): number {
    return product.inventory?.quantity || 0;
  }
}
