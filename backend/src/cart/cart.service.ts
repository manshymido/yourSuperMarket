import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';
import { ERROR_MESSAGES } from '../common/error-messages';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productHelperService: ProductHelperService,
    private inventoryHelperService: InventoryHelperService,
    private ownershipHelperService: OwnershipHelperService,
  ) {}

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    // Filter out inactive products and check inventory
    const validItems = cart.items.filter((item) => {
      const product = item.product;
      return (
        product.isActive &&
        this.inventoryHelperService.getAvailableQuantity(product) >=
          item.quantity
      );
    });

    return {
      ...cart,
      items: validItems,
    };
  }

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                inventory: true,
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Verify product exists and is active
    const product = await this.productHelperService.validateProductExistsAndActive(
      productId,
    );
    const productWithInventory = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    // Check inventory
    this.inventoryHelperService.validateProductStock(
      productWithInventory!,
      quantity,
      product.name,
    );

    // Get or create cart
    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      this.inventoryHelperService.validateProductStock(
        productWithInventory,
        newQuantity,
        product.name,
      );

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: true,
              inventory: true,
            },
          },
        },
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
            inventory: true,
          },
        },
      },
    });
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    // Verify cart item belongs to user
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: {
          include: { inventory: true },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(ERROR_MESSAGES.CART_ITEM_NOT_FOUND);
    }

    this.ownershipHelperService.verifyResourceOwnership(
      cartItem.cart,
      userId,
      'cart item',
    );

    // Check inventory
    this.inventoryHelperService.validateProductStock(
      cartItem.product,
      quantity,
      cartItem.product.name,
    );

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
            inventory: true,
          },
        },
      },
    });
  }

  async removeFromCart(userId: string, itemId: string) {
    // Verify cart item belongs to user
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException(ERROR_MESSAGES.CART_ITEM_NOT_FOUND);
    }

    this.ownershipHelperService.verifyResourceOwnership(
      cartItem.cart,
      userId,
      'cart item',
    );

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return { message: 'Cart is already empty' };
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared' };
  }
}
