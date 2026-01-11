import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { DeliveryStatus } from '@prisma/client';
import { USER_CONTACT_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async createDelivery(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true },
    });

    if (!order) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Find governorate
    const governorate = await this.prisma.governorate.findFirst({
      where: { name: order.address.governorate, isActive: true },
    });

    if (!governorate) {
      throw new NotFoundException(ERROR_MESSAGES.GOVERNORATE_NOT_FOUND);
    }

    // Create delivery
    return this.prisma.delivery.create({
      data: {
        orderId,
        governorateId: governorate.id,
        status: DeliveryStatus.PENDING,
      },
      include: {
        order: true,
        governorate: true,
      },
    });
  }

  async getAvailableDeliveries() {
    return this.prisma.delivery.findMany({
      where: {
        status: DeliveryStatus.ASSIGNED,
        driverId: null,
        order: {
          status: 'READY_FOR_DELIVERY',
        },
      },
      include: {
        order: {
          include: {
            address: true,
            user: {
              select: USER_CONTACT_SELECT,
            },
          },
        },
        governorate: true,
      },
    });
  }

  async acceptDelivery(driverId: string, deliveryId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(ERROR_MESSAGES.DELIVERY_NOT_FOUND);
    }

    if (delivery.driverId) {
      throw new BadRequestException(ERROR_MESSAGES.DELIVERY_ALREADY_ASSIGNED);
    }

    return this.prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        driverId,
        status: DeliveryStatus.ASSIGNED,
      },
      include: {
        order: {
          include: {
            address: true,
            user: true,
          },
        },
        governorate: true,
      },
    });
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
    driverId?: string,
  ) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(ERROR_MESSAGES.DELIVERY_NOT_FOUND);
    }

    if (driverId && delivery.driverId !== driverId) {
      throw new BadRequestException(
        ERROR_MESSAGES.DELIVERY_NOT_BELONGS_TO_DRIVER,
      );
    }

    const updateData: {
      status: DeliveryStatus;
      actualDeliveryTime?: Date;
    } = {
      status,
    };

    if (status === DeliveryStatus.DELIVERED) {
      updateData.actualDeliveryTime = new Date();
    }

    return this.prisma.delivery.update({
      where: { id: deliveryId },
      data: updateData,
      include: {
        order: true,
        driver: true,
        governorate: true,
      },
    });
  }

  async getDriverDeliveries(driverId: string) {
    return this.prisma.delivery.findMany({
      where: { driverId },
      include: {
        order: {
          include: {
            address: true,
            user: {
              select: USER_CONTACT_SELECT,
            },
          },
        },
        governorate: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
