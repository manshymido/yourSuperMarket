import { Injectable } from '@nestjs/common';

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable()
export class PaginationService {
  calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  calculatePagination(
    page: number,
    limit: number,
    total: number,
  ): PaginationResult {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
