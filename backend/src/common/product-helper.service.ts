import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Product } from '@prisma/client';
import { ERROR_MESSAGES } from './error-messages';

@Injectable()
export class ProductHelperService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validate that product exists and return it
   * @throws NotFoundException if product not found
   */
  async validateProductExists(productId: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  /**
   * Validate that product exists and is active
   * @throws NotFoundException if product not found
   * @throws BadRequestException if product is inactive
   */
  async validateProductExistsAndActive(productId: string): Promise<Product> {
    const product = await this.validateProductExists(productId);
    this.validateProductActive(product);
    return product;
  }

  /**
   * Validate that product is active
   * @throws BadRequestException if product is inactive
   */
  validateProductActive(product: Product): void {
    if (!product.isActive) {
      throw new BadRequestException(ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
    }
  }
}
