import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { PrismaService } from '../common/prisma.service';
import { USER_CONTACT_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';
import { DeliveryStatus } from '@prisma/client';
import {
  createMockPrismaService,
  createMockOrder,
  createMockAddress,
  createMockDelivery,
  createMockUser,
} from '../common/test-utils';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableDeliveries', () => {
    it('should use USER_CONTACT_SELECT', async () => {
      const mockOrder = createMockOrder();
      const mockUser = createMockUser();
      const mockDelivery = createMockDelivery();

      prismaService.delivery.findMany.mockResolvedValue([
        {
          ...mockDelivery,
          order: {
            ...mockOrder,
            address: createMockAddress(),
            user: {
              id: mockUser.id,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              email: mockUser.email,
              phone: mockUser.phone,
            },
          },
          governorate: { id: 'gov-123', name: 'Cairo', isActive: true },
        },
      ] as any);

      await service.getAvailableDeliveries();

      const callArgs = prismaService.delivery.findMany.mock.calls[0][0];
      expect(
        callArgs.include.order.include.user.select,
      ).toEqual(USER_CONTACT_SELECT);
    });
  });

  describe('getDriverDeliveries', () => {
    it('should use USER_CONTACT_SELECT', async () => {
      const mockOrder = createMockOrder();
      const mockUser = createMockUser();
      const mockDelivery = createMockDelivery();

      prismaService.delivery.findMany.mockResolvedValue([
        {
          ...mockDelivery,
          order: {
            ...mockOrder,
            address: createMockAddress(),
            user: {
              id: mockUser.id,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              email: mockUser.email,
              phone: mockUser.phone,
            },
          },
          governorate: { id: 'gov-123', name: 'Cairo', isActive: true },
        },
      ] as any);

      await service.getDriverDeliveries('driver-123');

      const callArgs = prismaService.delivery.findMany.mock.calls[0][0];
      expect(
        callArgs.include.order.include.user.select,
      ).toEqual(USER_CONTACT_SELECT);
    });
  });

  describe('createDelivery', () => {
    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.createDelivery('non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createDelivery('non-existent'),
      ).rejects.toThrow(ERROR_MESSAGES.ORDER_NOT_FOUND);
    });
  });

  describe('acceptDelivery', () => {
    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.delivery.findUnique.mockResolvedValue(null);

      await expect(
        service.acceptDelivery('driver-123', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.acceptDelivery('driver-123', 'non-existent'),
      ).rejects.toThrow(ERROR_MESSAGES.DELIVERY_NOT_FOUND);
    });
  });

  describe('updateDeliveryStatus', () => {
    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.delivery.findUnique.mockResolvedValue(null);

      await expect(
        service.updateDeliveryStatus('non-existent', DeliveryStatus.DELIVERED),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateDeliveryStatus('non-existent', DeliveryStatus.DELIVERED),
      ).rejects.toThrow(ERROR_MESSAGES.DELIVERY_NOT_FOUND);
    });
  });
});
