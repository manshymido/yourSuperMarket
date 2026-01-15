import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../common/prisma.service';
import { PaginationService } from '../common/pagination.service';
import { USER_PUBLIC_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';
import { OrderStatus } from '@prisma/client';
import {
  createMockPrismaService,
  createMockUser,
} from '../common/test-utils';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prismaService: jest.Mocked<PrismaService>;
  let paginationService: jest.Mocked<PaginationService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockPaginationService = {
      calculateSkip: jest.fn(),
      calculatePagination: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prismaService = module.get(PrismaService);
    paginationService = module.get(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByProduct', () => {
    it('should use PaginationService', async () => {
      const mockReview = {
        id: 'review-123',
        userId: 'user-123',
        productId: 'product-123',
        rating: 5,
        comment: 'Great product',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: createMockUser(),
      };

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 50,
        totalPages: 3,
      });
      prismaService.review.findMany.mockResolvedValue([mockReview] as any);
      prismaService.review.count.mockResolvedValue(50);

      await service.findByProduct('product-123', 1, 20);

      expect(paginationService.calculateSkip).toHaveBeenCalledWith(1, 20);
      expect(paginationService.calculatePagination).toHaveBeenCalledWith(
        1,
        20,
        50,
      );
    });

    it('should use USER_PUBLIC_SELECT', async () => {
      const mockReview = {
        id: 'review-123',
        userId: 'user-123',
        productId: 'product-123',
        rating: 5,
        comment: 'Great product',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: createMockUser(),
      };

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 50,
        totalPages: 3,
      });
      prismaService.review.findMany.mockResolvedValue([mockReview] as any);
      prismaService.review.count.mockResolvedValue(50);

      await service.findByProduct('product-123', 1, 20);

      const callArgs = prismaService.review.findMany.mock.calls[0][0];
      expect(callArgs.include.user.select).toEqual(USER_PUBLIC_SELECT);
    });
  });

  describe('create', () => {
    it('should use USER_PUBLIC_SELECT', async () => {
      const mockUser = createMockUser();
      const mockOrderItem = {
        id: 'order-item-123',
        productId: 'product-123',
        orderId: 'order-123',
      };

      prismaService.orderItem.findFirst.mockResolvedValue(
        mockOrderItem as any,
      );
      prismaService.review.findUnique.mockResolvedValue(null);
      prismaService.review.create.mockResolvedValue({
        id: 'review-123',
        userId: 'user-123',
        productId: 'product-123',
        rating: 5,
        comment: 'Great product',
        isApproved: false,
        user: {
          id: mockUser.id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      } as any);

      await service.create('user-123', 'product-123', 5, 'Great product');

      const callArgs = prismaService.review.create.mock.calls[0][0];
      expect(callArgs.include.user.select).toEqual(USER_PUBLIC_SELECT);
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.orderItem.findFirst.mockResolvedValue(null);

      await expect(
        service.create('user-123', 'product-123', 5, 'Comment'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create('user-123', 'product-123', 5, 'Comment'),
      ).rejects.toThrow(
        ERROR_MESSAGES.CAN_ONLY_REVIEW_PURCHASED_PRODUCTS,
      );
    });
  });
});
