import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { OrderStatus } from '@prisma/client';
import { PaginationService } from '../common/pagination.service';
import { USER_PUBLIC_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async create(
    userId: string,
    productId: string,
    rating: number,
    comment?: string,
  ) {
    // Check if user has purchased this product
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: OrderStatus.DELIVERED,
        },
      },
    });

    if (!hasPurchased) {
      throw new BadRequestException(
        ERROR_MESSAGES.CAN_ONLY_REVIEW_PURCHASED_PRODUCTS,
      );
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException(ERROR_MESSAGES.REVIEW_ALREADY_EXISTS);
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        isApproved: false, // Require admin approval
      },
      include: {
        user: {
          select: USER_PUBLIC_SELECT,
        },
      },
    });
  }

  async findByProduct(productId: string, page: number = 1, limit: number = 20) {
    const skip = this.paginationService.calculateSkip(page, limit);

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
        include: {
          user: {
            select: USER_PUBLIC_SELECT,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({
        where: {
          productId,
          isApproved: true,
        },
      }),
    ]);

    return {
      reviews,
      pagination: this.paginationService.calculatePagination(
        page,
        limit,
        total,
      ),
    };
  }

  async approveReview(reviewId: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
  }
}
