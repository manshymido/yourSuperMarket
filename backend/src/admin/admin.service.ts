import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PaginationService } from '../common/pagination.service';
import { USER_BASIC_SELECT, USER_CONTACT_SELECT } from '../common/user-selectors';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts, totalRevenue] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.order.count(),
        this.prisma.product.count(),
        this.prisma.order.aggregate({
          where: { status: 'DELIVERED' },
          _sum: { total: true },
        }),
      ]);

    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: USER_CONTACT_SELECT,
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentOrders,
    };
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = this.paginationService.calculateSkip(page, limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          ...USER_BASIC_SELECT,
          isActive: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: this.paginationService.calculatePagination(
        page,
        limit,
        total,
      ),
    };
  }

  async getAllOrders(page: number = 1, limit: number = 20) {
    const skip = this.paginationService.calculateSkip(page, limit);

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        include: {
          user: {
            select: USER_CONTACT_SELECT,
          },
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
          delivery: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return {
      orders,
      pagination: this.paginationService.calculatePagination(
        page,
        limit,
        total,
      ),
    };
  }
}
