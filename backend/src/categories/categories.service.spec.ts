import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../common/prisma.service';
import { SlugService } from '../common/slug.service';
import { ERROR_MESSAGES } from '../common/error-messages';
import {
  createMockPrismaService,
  createMockCategory,
} from '../common/test-utils';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: jest.Mocked<PrismaService>;
  let slugService: jest.Mocked<SlugService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockSlugService = {
      generateUniqueSlug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: SlugService,
          useValue: mockSlugService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get(PrismaService);
    slugService = module.get(SlugService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should use SlugService to generate unique slug', async () => {
      const createDto = {
        name: 'Test Category',
        description: 'Test description',
      };
      const mockCategory = createMockCategory();

      slugService.generateUniqueSlug.mockResolvedValue('test-category');
      prismaService.category.create.mockResolvedValue({
        ...mockCategory,
        parent: null,
        children: [],
        _count: { products: 0 },
      } as any);

      await service.create(createDto);

      expect(slugService.generateUniqueSlug).toHaveBeenCalledWith(
        'Test Category',
        'category',
      );
    });

    it('should create category with unique slug', async () => {
      const createDto = {
        name: 'Test Category',
      };
      const mockCategory = createMockCategory({ slug: 'test-category' });

      slugService.generateUniqueSlug.mockResolvedValue('test-category');
      prismaService.category.create.mockResolvedValue({
        ...mockCategory,
        parent: null,
        children: [],
        _count: { products: 0 },
      } as any);

      const result = await service.create(createDto);

      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          slug: 'test-category',
        },
        include: {
          parent: true,
          children: true,
          _count: {
            select: { products: true },
          },
        },
      });
      expect(result.slug).toBe('test-category');
    });
  });

  describe('update', () => {
    it('should use SlugService when name changes', async () => {
      const existingCategory = createMockCategory({ name: 'Old Name' });
      const updateDto = { name: 'New Name' };

      prismaService.category.findUnique.mockResolvedValue(
        existingCategory as any,
      );
      slugService.generateUniqueSlug.mockResolvedValue('new-name');
      prismaService.category.update.mockResolvedValue({
        ...existingCategory,
        name: 'New Name',
        slug: 'new-name',
        parent: null,
        children: [],
      } as any);

      await service.update('category-123', updateDto);

      expect(slugService.generateUniqueSlug).toHaveBeenCalledWith(
        'New Name',
        'category',
        'category-123',
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    });
  });

  describe('findOne', () => {
    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    });
  });

  describe('findBySlug', () => {
    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    });
  });
});
