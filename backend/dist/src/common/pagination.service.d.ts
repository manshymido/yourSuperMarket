export interface PaginationResult {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare class PaginationService {
    calculateSkip(page: number, limit: number): number;
    calculatePagination(page: number, limit: number, total: number): PaginationResult;
}
