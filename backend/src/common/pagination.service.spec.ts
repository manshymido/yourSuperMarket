import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  describe('calculateSkip', () => {
    it('should calculate correct skip value for page 1', () => {
      const result = service.calculateSkip(1, 20);
      expect(result).toBe(0);
    });

    it('should calculate correct skip value for page 2', () => {
      const result = service.calculateSkip(2, 20);
      expect(result).toBe(20);
    });

    it('should calculate correct skip value for page 3', () => {
      const result = service.calculateSkip(3, 10);
      expect(result).toBe(20);
    });

    it('should handle different limit values', () => {
      expect(service.calculateSkip(2, 50)).toBe(50);
      expect(service.calculateSkip(5, 10)).toBe(40);
    });
  });

  describe('calculatePagination', () => {
    it('should return correct pagination object', () => {
      const result = service.calculatePagination(1, 20, 100);

      expect(result).toEqual({
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      });
    });

    it('should calculate totalPages correctly', () => {
      expect(service.calculatePagination(1, 20, 100).totalPages).toBe(5);
      expect(service.calculatePagination(1, 10, 100).totalPages).toBe(10);
      expect(service.calculatePagination(1, 25, 100).totalPages).toBe(4);
    });

    it('should handle edge case when total is 0', () => {
      const result = service.calculatePagination(1, 20, 0);

      expect(result).toEqual({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    });

    it('should handle edge case when limit > total', () => {
      const result = service.calculatePagination(1, 100, 50);

      expect(result).toEqual({
        page: 1,
        limit: 100,
        total: 50,
        totalPages: 1,
      });
    });

    it('should round up totalPages when there is remainder', () => {
      const result = service.calculatePagination(1, 20, 95);

      expect(result.totalPages).toBe(5); // 95 / 20 = 4.75, rounded up to 5
    });

    it('should handle single page results', () => {
      const result = service.calculatePagination(1, 20, 15);

      expect(result).toEqual({
        page: 1,
        limit: 20,
        total: 15,
        totalPages: 1,
      });
    });
  });
});
