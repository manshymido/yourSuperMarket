import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from './slug.service';
import { PrismaService } from './prisma.service';
import { createMockPrismaService } from './test-utils';

describe('SlugService', () => {
  let service: SlugService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlugService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SlugService>(SlugService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateUniqueSlug', () => {
    it('should generate unique slug for products when slug does not exist', async () => {
      prismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.generateUniqueSlug('Test Product', 'product');

      expect(result).toBe('test-product');
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
      });
    });

    it('should generate unique slug for categories when slug does not exist', async () => {
      prismaService.category.findUnique.mockResolvedValue(null);

      const result = await service.generateUniqueSlug('Test Category', 'category');

      expect(result).toBe('test-category');
      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-category' },
      });
    });

    it('should append counter when slug exists', async () => {
      prismaService.product.findUnique
        .mockResolvedValueOnce({ id: 'existing-id' } as any)
        .mockResolvedValueOnce(null);

      const result = await service.generateUniqueSlug('Test Product', 'product');

      expect(result).toBe('test-product-1');
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(2);
    });

    it('should increment counter until unique slug is found', async () => {
      prismaService.product.findUnique
        .mockResolvedValueOnce({ id: 'existing-1' } as any)
        .mockResolvedValueOnce({ id: 'existing-2' } as any)
        .mockResolvedValueOnce(null);

      const result = await service.generateUniqueSlug('Test Product', 'product');

      expect(result).toBe('test-product-2');
      expect(prismaService.product.findUnique).toHaveBeenCalledTimes(3);
    });

    it('should handle excludeId parameter correctly for products', async () => {
      prismaService.product.findFirst.mockResolvedValue(null);

      const result = await service.generateUniqueSlug(
        'Test Product',
        'product',
        'exclude-id-123',
      );

      expect(result).toBe('test-product');
      expect(prismaService.product.findFirst).toHaveBeenCalledWith({
        where: { slug: 'test-product', id: { not: 'exclude-id-123' } },
      });
    });

    it('should handle excludeId parameter correctly for categories', async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      const result = await service.generateUniqueSlug(
        'Test Category',
        'category',
        'exclude-id-123',
      );

      expect(result).toBe('test-category');
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { slug: 'test-category', id: { not: 'exclude-id-123' } },
      });
    });

    it('should increment counter when slug exists with excludeId', async () => {
      prismaService.product.findFirst
        .mockResolvedValueOnce({ id: 'other-id' } as any)
        .mockResolvedValueOnce(null);

      const result = await service.generateUniqueSlug(
        'Test Product',
        'product',
        'exclude-id-123',
      );

      expect(result).toBe('test-product-1');
      expect(prismaService.product.findFirst).toHaveBeenCalledTimes(2);
    });
  });
});
