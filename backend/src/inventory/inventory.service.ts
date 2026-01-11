import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private prisma: PrismaService,
    private productHelperService: ProductHelperService,
  ) {}

  async updateInventory(productId: string, quantity: number) {
    // Validate product exists
    await this.productHelperService.validateProductExists(productId);

    // Fetch product with inventory
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    // Create inventory if it doesn't exist
    if (!product.inventory) {
      this.logger.log(`Creating inventory for product ${productId}`);
      return this.prisma.inventory.create({
        data: {
          productId,
          quantity,
        },
      });
    }

    return this.prisma.inventory.update({
      where: { productId },
      data: { quantity },
    });
  }

  async getLowStockItems() {
    // Fetch all inventories and filter in memory
    // Prisma doesn't support comparing two fields directly in a single query
    const inventories = await this.prisma.inventory.findMany({
      include: {
        product: true,
      },
    });

    // Filter items where quantity is less than or equal to lowStockThreshold
    return inventories.filter(
      (inventory) => inventory.quantity <= inventory.lowStockThreshold,
    );
  }
}
