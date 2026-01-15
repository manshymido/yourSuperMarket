import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';
import { ERROR_MESSAGES } from '../common/error-messages';
import {
  createMockPrismaService,
  createMockCart,
  createMockCartItem,
  createMockProduct,
  createMockInventory,
  createMockCategory,
} from '../common/test-utils';

describe('CartService', () => {
  let service: CartService;
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
        CartService,
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

    service = module.get<CartService>(CartService);
    prismaService = module.get(PrismaService);
    productHelperService = module.get(ProductHelperService);
    inventoryHelperService = module.get(InventoryHelperService);
    ownershipHelperService = module.get(OwnershipHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should use getOrCreateCart helper', async () => {
      const mockCart = createMockCart();
      const mockCategory = createMockCategory();
      const mockProduct = createMockProduct();
      const mockInventory = createMockInventory();
      const mockCartItem = createMockCartItem();

      prismaService.cart.findUnique.mockResolvedValue({
        ...mockCart,
        items: [
          {
            ...mockCartItem,
            product: {
              ...mockProduct,
              category: mockCategory,
              inventory: mockInventory,
            },
          },
        ],
      } as any);

      inventoryHelperService.getAvailableQuantity.mockReturnValue(100);

      const result = await service.getCart('user-123');

      expect(prismaService.cart.findUnique).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('addToCart', () => {
    it('should use ProductHelperService for validation', async () => {
      const mockProduct = createMockProduct();
      const mockInventory = createMockInventory();
      const mockCart = createMockCart();
      const mockCategory = createMockCategory();

      productHelperService.validateProductExistsAndActive.mockResolvedValue(
        mockProduct as any,
      );
      prismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        inventory: mockInventory,
      } as any);
      prismaService.cart.findUnique.mockResolvedValue(mockCart as any);
      prismaService.cartItem.findUnique.mockResolvedValue(null);
      prismaService.cartItem.create.mockResolvedValue({
        ...createMockCartItem(),
        product: {
          ...mockProduct,
          category: mockCategory,
          inventory: mockInventory,
        },
      } as any);

      await service.addToCart('user-123', {
        productId: 'product-123',
        quantity: 2,
      });

      expect(
        productHelperService.validateProductExistsAndActive,
      ).toHaveBeenCalledWith('product-123');
    });

    it('should use InventoryHelperService for stock validation', async () => {
      const mockProduct = createMockProduct();
      const mockInventory = createMockInventory({ quantity: 100 });
      const mockCart = createMockCart();
      const mockCategory = createMockCategory();

      productHelperService.validateProductExistsAndActive.mockResolvedValue(
        mockProduct as any,
      );
      prismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        inventory: mockInventory,
      } as any);
      prismaService.cart.findUnique.mockResolvedValue(mockCart as any);
      prismaService.cartItem.findUnique.mockResolvedValue(null);
      prismaService.cartItem.create.mockResolvedValue({
        ...createMockCartItem(),
        product: {
          ...mockProduct,
          category: mockCategory,
          inventory: mockInventory,
        },
      } as any);

      await service.addToCart('user-123', {
        productId: 'product-123',
        quantity: 2,
      });

      expect(inventoryHelperService.validateProductStock).toHaveBeenCalledWith(
        expect.objectContaining({ inventory: mockInventory }),
        2,
        mockProduct.name,
      );
    });
  });

  describe('updateCartItem', () => {
    it('should use OwnershipHelperService for verification', async () => {
      const mockCart = createMockCart({ userId: 'user-123' });
      const mockCartItem = createMockCartItem();
      const mockProduct = createMockProduct();
      const mockInventory = createMockInventory({ quantity: 100 });
      const mockCategory = createMockCategory();

      prismaService.cartItem.findUnique.mockResolvedValue({
        ...mockCartItem,
        cart: mockCart,
        product: {
          ...mockProduct,
          inventory: mockInventory,
        },
      } as any);
      prismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        product: {
          ...mockProduct,
          category: mockCategory,
          inventory: mockInventory,
        },
      } as any);

      await service.updateCartItem('user-123', 'cart-item-123', {
        quantity: 5,
      });

      expect(ownershipHelperService.verifyResourceOwnership).toHaveBeenCalledWith(
        mockCart,
        'user-123',
        'cart item',
      );
    });

    it('should use InventoryHelperService for stock validation', async () => {
      const mockCart = createMockCart({ userId: 'user-123' });
      const mockCartItem = createMockCartItem();
      const mockProduct = createMockProduct();
      const mockInventory = createMockInventory({ quantity: 100 });
      const mockCategory = createMockCategory();

      prismaService.cartItem.findUnique.mockResolvedValue({
        ...mockCartItem,
        cart: mockCart,
        product: {
          ...mockProduct,
          inventory: mockInventory,
        },
      } as any);
      prismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        product: {
          ...mockProduct,
          category: mockCategory,
          inventory: mockInventory,
        },
      } as any);

      await service.updateCartItem('user-123', 'cart-item-123', {
        quantity: 5,
      });

      expect(inventoryHelperService.validateProductStock).toHaveBeenCalledWith(
        expect.objectContaining({ inventory: mockInventory }),
        5,
        mockProduct.name,
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.cartItem.findUnique.mockResolvedValue(null);

      await expect(
        service.updateCartItem('user-123', 'non-existent', { quantity: 5 }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateCartItem('user-123', 'non-existent', { quantity: 5 }),
      ).rejects.toThrow(ERROR_MESSAGES.CART_ITEM_NOT_FOUND);
    });
  });

  describe('removeFromCart', () => {
    it('should use OwnershipHelperService for verification', async () => {
      const mockCart = createMockCart({ userId: 'user-123' });
      const mockCartItem = createMockCartItem();

      prismaService.cartItem.findUnique.mockResolvedValue({
        ...mockCartItem,
        cart: mockCart,
      } as any);
      prismaService.cartItem.delete.mockResolvedValue(mockCartItem as any);

      await service.removeFromCart('user-123', 'cart-item-123');

      expect(ownershipHelperService.verifyResourceOwnership).toHaveBeenCalledWith(
        mockCart,
        'user-123',
        'cart item',
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.cartItem.findUnique.mockResolvedValue(null);

      await expect(
        service.removeFromCart('user-123', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.removeFromCart('user-123', 'non-existent'),
      ).rejects.toThrow(ERROR_MESSAGES.CART_ITEM_NOT_FOUND);
    });
  });
});
