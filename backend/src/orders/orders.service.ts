import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, UserRole, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, notes } = createOrderDto;

    // Verify address belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Address does not belong to user');
    }

    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify all items are available and calculate totals
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: Prisma.Decimal;
    }> = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product.isActive) {
        throw new BadRequestException(
          `Product ${product.name} is no longer available`,
        );
      }

      const availableQuantity = product.inventory?.quantity || 0;
      if (availableQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${availableQuantity}`,
        );
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Get delivery fee based on governorate
    const governorate = await this.prisma.governorate.findFirst({
      where: { name: address.governorate, isActive: true },
    });

    const deliveryFee = governorate?.deliveryFee
      ? Number(governorate.deliveryFee)
      : 0;
    // Get tax rate from environment variable (default to 14% for Egypt)
    const taxRate = parseFloat(process.env.TAX_RATE || '0.14');
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFee + tax;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          orderNumber,
          status: OrderStatus.PENDING,
          subtotal,
          deliveryFee,
          tax,
          total,
          notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Reserve inventory
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
            reserved: {
              increment: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string, role: UserRole) {
    const where: Prisma.OrderWhereInput = {};

    // Only customers can see their own orders
    if (role === UserRole.CUSTOMER) {
      where.userId = userId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        delivery: {
          include: {
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
            governorate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        payment: true,
        delivery: {
          include: {
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
            governorate: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only customers can see their own orders, admins can see all
    if (role === UserRole.CUSTOMER && order.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    userId: string,
    role: UserRole,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only admins can update order status
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update order status');
    }

    const { status } = updateOrderStatusDto;

    // Handle status transitions
    if (
      status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // If cancelling, restore inventory
    if (status === OrderStatus.CANCELLED) {
      await this.restoreInventory(order.id);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        delivery: true,
      },
    });
  }

  private async restoreInventory(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) return;

    for (const item of order.items) {
      await this.prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            increment: item.quantity,
          },
          reserved: {
            decrement: item.quantity,
          },
        },
      });
    }
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}
