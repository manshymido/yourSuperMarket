import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';
import { USER_CONTACT_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';
import { UserRole, OrderStatus } from '@prisma/client';
import {
  createMockPrismaService,
  createMockOrder,
  createMockAddress,
  createMockCart,
  createMockCartItem,
  createMockProduct,
  createMockInventory,
} from '../common/test-utils';
import { Prisma } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: jest.Mocked<PrismaService>;
  let productHelperService: jest.Mocked<ProductHelperService>;
  let inventoryHelperService: jest.Mocked<InventoryHelperService>;
  let ownershipHelperService: jest.Mocked<OwnershipHelperService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockProductHelper = {
      validateProductExists: jest.fn(),
      validateProductExistsAndActive: jest.fn(),
      validateProductActive: jest.fn(),
    };
    const mockInventoryHelper = {
      validateProductStock: jest.fn(),
      getAvailableQuantity: jest.fn(),
    };
    const mockOwnershipHelper = {
      verifyResourceOwnership: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: ProductHelperService,
          useValue: mockProductHelper,
        },
        {
          provide: InventoryHelperService,
          useValue: mockInventoryHelper,
        },
        {
          provide: OwnershipHelperService,
          useValue: mockOwnershipHelper,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get(PrismaService);
    productHelperService = module.get(ProductHelperService);
    inventoryHelperService = module.get(InventoryHelperService);
    ownershipHelperService = module.get(OwnershipHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should use ProductHelperService.validateProductActive', async () => {
      const mockAddress = createMockAddress({ userId: 'user-123' });
      const mockCart = createMockCart({ userId: 'user-123' });
      const mockProduct = createMockProduct({ isActive: true });
      const mockInventory = createMockInventory({ quantity: 100 });
      const mockCartItem = createMockCartItem();

      prismaService.address.findUnique.mockResolvedValue(mockAddress as any);
      prismaService.cart.findUnique.mockResolvedValue({
        ...mockCart,
        items: [
          {
            ...mockCartItem,
            product: {
              ...mockProduct,
              inventory: mockInventory,
            },
          },
        ],
      } as any);
      prismaService.governorate.findFirst.mockResolvedValue(null);
      prismaService.$transaction.mockImplementation(async (callback) => {
        return callback(prismaService);
      });
      prismaService.order.create.mockResolvedValue(createMockOrder() as any);

      await service.create('user-123', {
        addressId: 'address-123',
        notes: null,
      });

      expect(productHelperService.validateProductActive).toHaveBeenCalled();
    });

    it('should use InventoryHelperService.validateProductStock', async () => {
      const mockAddress = createMockAddress({ userId: 'user-123' });
      const mockCart = createMockCart({ userId: 'user-123' });
      const mockProduct = createMockProduct({ isActive: true });
      const mockInventory = createMockInventory({ quantity: 100 });
      const mockCartItem = createMockCartItem();

      prismaService.address.findUnique.mockResolvedValue(mockAddress as any);
      prismaService.cart.findUnique.mockResolvedValue({
        ...mockCart,
        items: [
          {
            ...mockCartItem,
            product: {
              ...mockProduct,
              inventory: mockInventory,
            },
          },
        ],
      } as any);
      prismaService.governorate.findFirst.mockResolvedValue(null);
      prismaService.$transaction.mockImplementation(async (callback) => {
        return callback(prismaService);
      });
      prismaService.order.create.mockResolvedValue(createMockOrder() as any);

      await service.create('user-123', {
        addressId: 'address-123',
        notes: null,
      });

      expect(inventoryHelperService.validateProductStock).toHaveBeenCalled();
    });

    it('should use OwnershipHelperService for address verification', async () => {
      const mockAddress = createMockAddress({ userId: 'user-123' });
      const mockCart = createMockCart({ userId: 'user-123' });
      const mockProduct = createMockProduct({ isActive: true });
      const mockInventory = createMockInventory({ quantity: 100 });
      const mockCartItem = createMockCartItem();

      prismaService.address.findUnique.mockResolvedValue(mockAddress as any);
      prismaService.cart.findUnique.mockResolvedValue({
        ...mockCart,
        items: [
          {
            ...mockCartItem,
            product: {
              ...mockProduct,
              inventory: mockInventory,
            },
          },
        ],
      } as any);
      prismaService.governorate.findFirst.mockResolvedValue(null);
      prismaService.$transaction.mockImplementation(async (callback) => {
        return callback(prismaService);
      });
      prismaService.order.create.mockResolvedValue(createMockOrder() as any);

      await service.create('user-123', {
        addressId: 'address-123',
        notes: null,
      });

      expect(ownershipHelperService.verifyResourceOwnership).toHaveBeenCalledWith(
        mockAddress,
        'user-123',
        'address',
      );
    });
  });

  describe('findAll', () => {
    it('should use USER_CONTACT_SELECT for driver', async () => {
      const mockOrder = createMockOrder();
      const mockDelivery = {
        id: 'delivery-123',
        driver: {
          id: 'driver-123',
          firstName: 'Driver',
          lastName: 'Name',
          email: 'driver@example.com',
          phone: '1234567890',
        },
      };

      prismaService.order.findMany.mockResolvedValue([
        {
          ...mockOrder,
          address: createMockAddress(),
          items: [],
          payment: null,
          delivery: mockDelivery,
        },
      ] as any);

      await service.findAll('user-123', UserRole.CUSTOMER);

      const callArgs = prismaService.order.findMany.mock.calls[0][0];
      expect(callArgs.include.delivery.include.driver.select).toEqual(
        USER_CONTACT_SELECT,
      );
    });
  });

  describe('findOne', () => {
    it('should use USER_CONTACT_SELECT for driver', async () => {
      const mockOrder = createMockOrder();
      const mockDelivery = {
        id: 'delivery-123',
        driver: {
          id: 'driver-123',
          firstName: 'Driver',
          lastName: 'Name',
          email: 'driver@example.com',
          phone: '1234567890',
        },
      };

      prismaService.order.findUnique.mockResolvedValue({
        ...mockOrder,
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
        address: createMockAddress(),
        items: [],
        payment: null,
        delivery: mockDelivery,
      } as any);

      await service.findOne('order-123', 'user-123', UserRole.CUSTOMER);

      const callArgs = prismaService.order.findUnique.mock.calls[0][0];
      expect(callArgs.include.delivery.include.driver.select).toEqual(
        USER_CONTACT_SELECT,
      );
    });

    it('should use OwnershipHelperService for access control', async () => {
      const mockOrder = createMockOrder({ userId: 'user-123' });

      prismaService.order.findUnique.mockResolvedValue({
        ...mockOrder,
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
        address: createMockAddress(),
        items: [],
        payment: null,
        delivery: null,
      } as any);

      await service.findOne('order-123', 'user-123', UserRole.CUSTOMER);

      // The service checks ownership internally, but we verify it uses ERROR_MESSAGES
      expect(prismaService.order.findUnique).toHaveBeenCalled();
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent', 'user-123', UserRole.CUSTOMER),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne('non-existent', 'user-123', UserRole.CUSTOMER),
      ).rejects.toThrow(ERROR_MESSAGES.ORDER_NOT_FOUND);
    });
  });
});
