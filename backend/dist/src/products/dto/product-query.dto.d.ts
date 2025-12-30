export declare class ProductQueryDto {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
