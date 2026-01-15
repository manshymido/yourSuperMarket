"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const pagination_service_1 = require("../common/pagination.service");
const user_selectors_1 = require("../common/user-selectors");
let AdminService = class AdminService {
    prisma;
    paginationService;
    constructor(prisma, paginationService) {
        this.prisma = prisma;
        this.paginationService = paginationService;
    }
    async getDashboardStats() {
        const [totalUsers, totalOrders, totalProducts, totalRevenue] = await Promise.all([
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
                    select: user_selectors_1.USER_CONTACT_SELECT,
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
    async getAllUsers(page = 1, limit = 20) {
        const skip = this.paginationService.calculateSkip(page, limit);
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                select: {
                    ...user_selectors_1.USER_BASIC_SELECT,
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
            pagination: this.paginationService.calculatePagination(page, limit, total),
        };
    }
    async getAllOrders(page = 1, limit = 20) {
        const skip = this.paginationService.calculateSkip(page, limit);
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                include: {
                    user: {
                        select: user_selectors_1.USER_CONTACT_SELECT,
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
            pagination: this.paginationService.calculatePagination(page, limit, total),
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.PaginationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map