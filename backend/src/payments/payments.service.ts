import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PaymentStatus, PaymentMethod, Prisma } from '@prisma/client';
import { ERROR_MESSAGES } from '../common/error-messages';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async createPayment(orderId: string, method: PaymentMethod) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Check if payment already exists
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      return existingPayment;
    }

    if (method === PaymentMethod.CASH_ON_DELIVERY) {
      // Create cash on delivery payment
      return this.prisma.payment.create({
        data: {
          orderId,
          amount: order.total,
          method: PaymentMethod.CASH_ON_DELIVERY,
          status: PaymentStatus.PENDING,
        },
      });
    }

    // Paymob integration
    if (method === PaymentMethod.PAYMOB) {
      return this.initiatePaymobPayment(order);
    }

    throw new BadRequestException(ERROR_MESSAGES.INVALID_PAYMENT_METHOD);
  }

  private async initiatePaymobPayment(order: {
    id: string;
    total: Prisma.Decimal;
  }) {
    try {
      // Step 1: Get auth token
      const authResponse = await axios.post<{ token: string }>(
        'https://accept.paymob.com/api/auth/tokens',
        {
          api_key: process.env.PAYMOB_API_KEY,
        },
      );

      const authToken = authResponse.data.token;

      const totalAmount = Number(order.total);

      // Step 2: Create order
      const orderResponse = await axios.post<{ id: number }>(
        'https://accept.paymob.com/api/ecommerce/orders',
        {
          auth_token: authToken,
          delivery_needed: 'false',
          amount_cents: Math.round(totalAmount * 100), // Convert to cents
          currency: 'EGP',
          items: [],
        },
      );

      const paymobOrderId = orderResponse.data.id;

      // Step 3: Get payment key
      const paymentKeyResponse = await axios.post<{ token: string }>(
        'https://accept.paymob.com/api/acceptance/payment_keys',
        {
          auth_token: authToken,
          amount_cents: Math.round(totalAmount * 100),
          expiration: 3600,
          order_id: paymobOrderId,
          billing_data: {
            apartment: 'NA',
            email: 'customer@example.com',
            floor: 'NA',
            first_name: 'Customer',
            street: 'NA',
            building: 'NA',
            phone_number: '01000000000',
            shipping_method: 'NA',
            postal_code: 'NA',
            city: 'NA',
            country: 'EG',
            last_name: 'Customer',
            state: 'NA',
          },
          currency: 'EGP',
          integration_id: process.env.PAYMOB_INTEGRATION_ID,
        },
      );

      const paymentKey = paymentKeyResponse.data.token;

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          method: PaymentMethod.PAYMOB,
          status: PaymentStatus.PENDING,
          paymobOrderId: paymobOrderId.toString(),
        },
      });

      return {
        ...payment,
        paymentKey,
        iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_INTEGRATION_ID}?payment_token=${paymentKey}`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Paymob payment initiation failed: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(
        `Paymob payment initiation failed: ${errorMessage}`,
      );
    }
  }

  async handlePaymobCallback(data: unknown) {
    interface PaymobCallbackData {
      obj: {
        success: boolean;
        id?: number | string;
        order: {
          id: number | string;
        };
      };
    }

    const callbackData = data as PaymobCallbackData;
    const { obj } = callbackData;
    const orderId = String(obj.order.id);

    const payment = await this.prisma.payment.findFirst({
      where: { paymobOrderId: orderId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    let status: PaymentStatus = PaymentStatus.PENDING;
    if (obj.success) {
      status = PaymentStatus.COMPLETED;
    } else {
      status = PaymentStatus.FAILED;
    }

    const transactionId = obj.id ? String(obj.id) : null;

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        transactionId,
        paidAt: status === PaymentStatus.COMPLETED ? new Date() : null,
      },
    });

    // Update order status if payment completed
    if (status === PaymentStatus.COMPLETED) {
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' },
      });
    }

    return updatedPayment;
  }
}
