import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../common/prisma.service';
import { ERROR_MESSAGES } from '../common/error-messages';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import {
  createMockPrismaService,
  createMockOrder,
  createMockPayment,
} from '../common/test-utils';
import { Prisma } from '@prisma/client';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should use ERROR_MESSAGES.ORDER_NOT_FOUND', async () => {
      prismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.createPayment('non-existent', PaymentMethod.CASH_ON_DELIVERY),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createPayment('non-existent', PaymentMethod.CASH_ON_DELIVERY),
      ).rejects.toThrow(ERROR_MESSAGES.ORDER_NOT_FOUND);
    });

    it('should use ERROR_MESSAGES.INVALID_PAYMENT_METHOD', async () => {
      const mockOrder = createMockOrder();

      prismaService.order.findUnique.mockResolvedValue(mockOrder as any);
      prismaService.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.createPayment('order-123', 'INVALID_METHOD' as PaymentMethod),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createPayment('order-123', 'INVALID_METHOD' as PaymentMethod),
      ).rejects.toThrow(ERROR_MESSAGES.INVALID_PAYMENT_METHOD);
    });
  });

  describe('handlePaymobCallback', () => {
    it('should use ERROR_MESSAGES.PAYMENT_NOT_FOUND', async () => {
      prismaService.payment.findFirst.mockResolvedValue(null);

      const callbackData = {
        obj: {
          success: true,
          id: 123,
          order: { id: 456 },
        },
      };

      await expect(
        service.handlePaymobCallback(callbackData),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.handlePaymobCallback(callbackData),
      ).rejects.toThrow(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    });
  });
});
