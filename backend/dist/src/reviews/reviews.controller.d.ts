import { ReviewsService } from './reviews.service';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: CurrentUserPayload, productId: string, createReviewDto: CreateReviewDto): Promise<{
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
    findByProduct(productId: string, pagination: PaginationDto): Promise<{
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
