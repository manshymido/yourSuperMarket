import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { InventoryHelperService, ProductWithInventory } from './inventory-helper.service';
import { PrismaService } from './prisma.service';
import { ERROR_MESSAGES } from './error-messages';
import { createMockPrismaService, createMockProduct, createMockInventory } from './test-utils';

describe('InventoryHelperService', () => {
  let service: InventoryHelperService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryHelperService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<InventoryHelperService>(InventoryHelperService);
    prismaService = module.get(PrismaService);
  });

  describe('validateProductStock', () => {
    it('should not throw when stock is sufficient', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: createMockInventory({ quantity: 100 }),
      };

      expect(() => {
        service.validateProductStock(product, 50);
      }).not.toThrow();
    });

    it('should throw BadRequestException when stock is insufficient', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: createMockInventory({ quantity: 10 }),
      };

      expect(() => {
        service.validateProductStock(product, 50);
      }).toThrow(BadRequestException);
    });

    it('should use productName parameter in error message', () => {
      const product: ProductWithInventory = {
        ...createMockProduct({ name: 'Original Name' }),
        inventory: createMockInventory({ quantity: 10 }),
      };

      try {
        service.validateProductStock(product, 50, 'Custom Product Name');
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Custom Product Name');
        expect(error.message).toContain(ERROR_MESSAGES.INSUFFICIENT_STOCK);
        expect(error.message).toContain('Available: 10');
      }
    });

    it('should use product.name when productName not provided', () => {
      const product: ProductWithInventory = {
        ...createMockProduct({ name: 'Test Product Name' }),
        inventory: createMockInventory({ quantity: 10 }),
      };

      try {
        service.validateProductStock(product, 50);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Test Product Name');
        expect(error.message).toContain(ERROR_MESSAGES.INSUFFICIENT_STOCK);
      }
    });

    it('should handle exact stock match', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: createMockInventory({ quantity: 50 }),
      };

      expect(() => {
        service.validateProductStock(product, 50);
      }).not.toThrow();
    });

    it('should handle null inventory', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: null,
      };

      expect(() => {
        service.validateProductStock(product, 1);
      }).toThrow(BadRequestException);
    });
  });

  describe('getAvailableQuantity', () => {
    it('should return inventory quantity', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: createMockInventory({ quantity: 100 }),
      };

      const result = service.getAvailableQuantity(product);
      expect(result).toBe(100);
    });

    it('should return 0 when inventory is null', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: null,
      };

      const result = service.getAvailableQuantity(product);
      expect(result).toBe(0);
    });

    it('should return 0 when inventory is undefined', () => {
      const product: ProductWithInventory = {
        ...createMockProduct(),
        inventory: undefined,
      };

      const result = service.getAvailableQuantity(product);
      expect(result).toBe(0);
    });
  });
});
