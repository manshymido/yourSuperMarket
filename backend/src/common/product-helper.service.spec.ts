import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductHelperService } from './product-helper.service';
import { PrismaService } from './prisma.service';
import { ERROR_MESSAGES } from './error-messages';
import { createMockPrismaService, createMockProduct } from './test-utils';

describe('ProductHelperService', () => {
  let service: ProductHelperService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductHelperService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProductHelperService>(ProductHelperService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateProductExists', () => {
    it('should return product when it exists', async () => {
      const mockProduct = createMockProduct();
      prismaService.product.findUnique.mockResolvedValue(mockProduct as any);

      const result = await service.validateProductExists('product-123');

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-123' },
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      prismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.validateProductExists('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.validateProductExists('non-existent-id'),
      ).rejects.toThrow(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    });
  });

  describe('validateProductExistsAndActive', () => {
    it('should return product when exists and active', async () => {
      const mockProduct = createMockProduct({ isActive: true });
      prismaService.product.findUnique.mockResolvedValue(mockProduct as any);

      const result = await service.validateProductExistsAndActive('product-123');

      expect(result).toEqual(mockProduct);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-123' },
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      prismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.validateProductExistsAndActive('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when product is inactive', async () => {
      const mockProduct = createMockProduct({ isActive: false });
      prismaService.product.findUnique.mockResolvedValue(mockProduct as any);

      await expect(
        service.validateProductExistsAndActive('product-123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.validateProductExistsAndActive('product-123'),
      ).rejects.toThrow(ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
    });
  });

  describe('validateProductActive', () => {
    it('should not throw when product is active', () => {
      const product = createMockProduct({ isActive: true });

      expect(() => {
        service.validateProductActive(product as any);
      }).not.toThrow();
    });

    it('should throw BadRequestException when product is inactive', () => {
      const product = createMockProduct({ isActive: false });

      expect(() => {
        service.validateProductActive(product as any);
      }).toThrow(BadRequestException);
      expect(() => {
        service.validateProductActive(product as any);
      }).toThrow(ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
    });
  });
});
