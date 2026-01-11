import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../common/prisma.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { SlugService } from '../common/slug.service';
import { PaginationService } from '../common/pagination.service';
import { ProductHelperService } from '../common/product-helper.service';
import { ERROR_MESSAGES } from '../common/error-messages';
import {
  createMockPrismaService,
  createMockProduct,
  createMockCategory,
  createMockInventory,
} from '../common/test-utils';
import { Prisma } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: jest.Mocked<PrismaService>;
  let cloudinaryService: jest.Mocked<CloudinaryService>;
  let slugService: jest.Mocked<SlugService>;
  let paginationService: jest.Mocked<PaginationService>;
  let productHelperService: jest.Mocked<ProductHelperService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockCloudinary = {
      uploadMultipleImages: jest.fn(),
      deleteImage: jest.fn(),
      extractPublicId: jest.fn(),
    };
    const mockSlugService = {
      generateUniqueSlug: jest.fn(),
    };
    const mockPaginationService = {
      calculateSkip: jest.fn(),
      calculatePagination: jest.fn(),
    };
    const mockProductHelperService = {
      validateProductExists: jest.fn(),
      validateProductExistsAndActive: jest.fn(),
      validateProductActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinary,
        },
        {
          provide: SlugService,
          useValue: mockSlugService,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
        {
          provide: ProductHelperService,
          useValue: mockProductHelperService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get(PrismaService);
    cloudinaryService = module.get(CloudinaryService);
    slugService = module.get(SlugService);
    paginationService = module.get(PaginationService);
    productHelperService = module.get(ProductHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should use SlugService to generate unique slug', async () => {
      const createDto = {
        name: 'Test Product',
        price: new Prisma.Decimal('99.99'),
        categoryId: 'category-123',
      };
      const mockProduct = createMockProduct();
      const mockCategory = createMockCategory();

      slugService.generateUniqueSlug.mockResolvedValue('test-product');
      prismaService.product.create.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
        inventory: null,
        _count: { reviews: 0 },
      } as any);
      prismaService.inventory.create.mockResolvedValue(
        createMockInventory() as any,
      );

      await service.create(createDto);

      expect(slugService.generateUniqueSlug).toHaveBeenCalledWith(
        'Test Product',
        'product',
      );
    });

    it('should create product with unique slug', async () => {
      const createDto = {
        name: 'Test Product',
        price: new Prisma.Decimal('99.99'),
        categoryId: 'category-123',
      };
      const mockProduct = createMockProduct({ slug: 'test-product' });
      const mockCategory = createMockCategory();

      slugService.generateUniqueSlug.mockResolvedValue('test-product');
      prismaService.product.create.mockResolvedValue({
        ...mockProduct,
        category: mockCategory,
        inventory: null,
        _count: { reviews: 0 },
      } as any);
      prismaService.inventory.create.mockResolvedValue(
        createMockInventory() as any,
      );

      const result = await service.create(createDto);

      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          slug: 'test-product',
          images: [],
        },
        include: {
          category: true,
          inventory: true,
          _count: {
            select: { reviews: true },
          },
        },
      });
      expect(result.slug).toBe('test-product');
    });
  });

  describe('findAll', () => {
    it('should use PaginationService for pagination', async () => {
      const query = { page: 2, limit: 10 };
      const mockProducts = [createMockProduct()];
      const mockCategory = createMockCategory();

      paginationService.calculateSkip.mockReturnValue(10);
      paginationService.calculatePagination.mockReturnValue({
        page: 2,
        limit: 10,
        total: 50,
        totalPages: 5,
      });
      prismaService.product.findMany.mockResolvedValue(
        mockProducts.map((p) => ({
          ...p,
          category: mockCategory,
          inventory: null,
          _count: { reviews: 0 },
        })) as any,
      );
      prismaService.product.count.mockResolvedValue(50);

      await service.findAll(query);

      expect(paginationService.calculateSkip).toHaveBeenCalledWith(2, 10);
      expect(paginationService.calculatePagination).toHaveBeenCalledWith(
        2,
        10,
        50,
      );
    });

    it('should return correct pagination metadata', async () => {
      const query = { page: 1, limit: 20 };
      const mockProducts = [createMockProduct()];
      const mockCategory = createMockCategory();

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      });
      prismaService.product.findMany.mockResolvedValue(
        mockProducts.map((p) => ({
          ...p,
          category: mockCategory,
          inventory: null,
          _count: { reviews: 0 },
        })) as any,
      );
      prismaService.product.count.mockResolvedValue(100);

      const result = await service.findAll(query);

      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      });
    });
  });

  describe('findOne', () => {
    it('should use findProductWithDetails helper', async () => {
      const mockProduct = createMockProduct();
      const mockCategory = createMockCategory();

      prismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        category: { ...mockCategory, parent: null },
        inventory: null,
        reviews: [],
        _count: { reviews: 0 },
      } as any);

      const result = await service.findOne('product-123');

      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-123' },
        include: expect.objectContaining({
          category: expect.any(Object),
          inventory: true,
          reviews: expect.any(Object),
        }),
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when product not found', async () => {
      prismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        ERROR_MESSAGES.PRODUCT_NOT_FOUND,
      );
    });
  });

  describe('findBySlug', () => {
    it('should use findProductWithDetails helper', async () => {
      const mockProduct = createMockProduct();
      const mockCategory = createMockCategory();

      prismaService.product.findUnique.mockResolvedValue({
        ...mockProduct,
        category: { ...mockCategory, parent: null },
        inventory: null,
        reviews: [],
        _count: { reviews: 0 },
      } as any);

      const result = await service.findBySlug('test-product');

      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
        include: expect.objectContaining({
          category: expect.any(Object),
          inventory: true,
          reviews: expect.any(Object),
        }),
      });
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should use SlugService when name changes', async () => {
      const existingProduct = createMockProduct({ name: 'Old Name' });
      const updateDto = { name: 'New Name' };
      const mockCategory = createMockCategory();

      productHelperService.validateProductExists.mockResolvedValue(
        existingProduct as any,
      );
      slugService.generateUniqueSlug.mockResolvedValue('new-name');
      prismaService.product.update.mockResolvedValue({
        ...existingProduct,
        name: 'New Name',
        slug: 'new-name',
        category: mockCategory,
        inventory: null,
      } as any);

      await service.update('product-123', updateDto);

      expect(slugService.generateUniqueSlug).toHaveBeenCalledWith(
        'New Name',
        'product',
        'product-123',
      );
    });

    it('should use ProductHelperService for validation', async () => {
      const existingProduct = createMockProduct();
      const updateDto = { description: 'New description' };
      const mockCategory = createMockCategory();

      productHelperService.validateProductExists.mockResolvedValue(
        existingProduct as any,
      );
      prismaService.product.update.mockResolvedValue({
        ...existingProduct,
        category: mockCategory,
        inventory: null,
      } as any);

      await service.update('product-123', updateDto);

      expect(productHelperService.validateProductExists).toHaveBeenCalledWith(
        'product-123',
      );
    });
  });

  describe('remove', () => {
    it('should use ProductHelperService for validation', async () => {
      const mockProduct = createMockProduct({ images: [] });

      productHelperService.validateProductExists.mockResolvedValue(
        mockProduct as any,
      );
      prismaService.product.delete.mockResolvedValue(mockProduct as any);

      await service.remove('product-123');

      expect(productHelperService.validateProductExists).toHaveBeenCalledWith(
        'product-123',
      );
    });
  });
});
