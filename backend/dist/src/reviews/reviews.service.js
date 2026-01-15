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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const client_1 = require("@prisma/client");
const pagination_service_1 = require("../common/pagination.service");
const user_selectors_1 = require("../common/user-selectors");
const error_messages_1 = require("../common/error-messages");
let ReviewsService = class ReviewsService {
    prisma;
    paginationService;
    constructor(prisma, paginationService) {
        this.prisma = prisma;
        this.paginationService = paginationService;
    }
    async create(userId, productId, rating, comment) {
        const hasPurchased = await this.prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: client_1.OrderStatus.DELIVERED,
                },
            },
        });
        if (!hasPurchased) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.CAN_ONLY_REVIEW_PURCHASED_PRODUCTS);
        }
        const existingReview = await this.prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.REVIEW_ALREADY_EXISTS);
        }
        return this.prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment,
                isApproved: false,
            },
            include: {
                user: {
                    select: user_selectors_1.USER_PUBLIC_SELECT,
                },
            },
        });
    }
    async findByProduct(productId, page = 1, limit = 20) {
        const skip = this.paginationService.calculateSkip(page, limit);
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: {
                    productId,
                    isApproved: true,
                },
                include: {
                    user: {
                        select: user_selectors_1.USER_PUBLIC_SELECT,
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
            pagination: this.paginationService.calculatePagination(page, limit, total),
        };
    }
    async approveReview(reviewId) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { isApproved: true },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.PaginationService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map