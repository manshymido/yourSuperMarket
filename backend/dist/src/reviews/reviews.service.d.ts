import { PrismaService } from '../common/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, productId: string, rating: number, comment?: string): Promise<{
        user: {
            firstName: string | null;
            lastName: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        productId: string;
        isApproved: boolean;
        rating: number;
        comment: string | null;
    }>;
    findByProduct(productId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            user: {
                firstName: string | null;
                lastName: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            productId: string;
            isApproved: boolean;
            rating: number;
            comment: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    approveReview(reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        productId: string;
        isApproved: boolean;
        rating: number;
        comment: string | null;
    }>;
}
