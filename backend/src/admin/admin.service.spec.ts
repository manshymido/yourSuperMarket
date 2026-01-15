import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../common/prisma.service';
import { PaginationService } from '../common/pagination.service';
import { USER_BASIC_SELECT, USER_CONTACT_SELECT } from '../common/user-selectors';
import {
  createMockPrismaService,
  createMockUser,
  createMockOrder,
  createMockProduct,
} from '../common/test-utils';
import { Prisma } from '@prisma/client';

describe('AdminService', () => {
  let service: AdminService;
  let prismaService: jest.Mocked<PrismaService>;
  let paginationService: jest.Mocked<PaginationService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockPaginationService = {
      calculateSkip: jest.fn(),
      calculatePagination: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prismaService = module.get(PrismaService);
    paginationService = module.get(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should use PaginationService', async () => {
      const mockUsers = [createMockUser()];

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      });
      prismaService.user.findMany.mockResolvedValue(mockUsers as any);
      prismaService.user.count.mockResolvedValue(100);

      await service.getAllUsers(1, 20);

      expect(paginationService.calculateSkip).toHaveBeenCalledWith(1, 20);
      expect(paginationService.calculatePagination).toHaveBeenCalledWith(
        1,
        20,
        100,
      );
    });

    it('should use USER_BASIC_SELECT', async () => {
      const mockUsers = [createMockUser()];

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      });
      prismaService.user.findMany.mockResolvedValue(mockUsers as any);
      prismaService.user.count.mockResolvedValue(100);

      await service.getAllUsers(1, 20);

      const callArgs = prismaService.user.findMany.mock.calls[0][0];
      expect(callArgs.select).toMatchObject(USER_BASIC_SELECT);
      expect(callArgs.select.isActive).toBe(true);
      expect(callArgs.select.createdAt).toBe(true);
    });
  });

  describe('getAllOrders', () => {
    it('should use PaginationService', async () => {
      const mockOrder = createMockOrder();

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 50,
        totalPages: 3,
      });
      prismaService.order.findMany.mockResolvedValue([mockOrder] as any);
      prismaService.order.count.mockResolvedValue(50);

      await service.getAllOrders(1, 20);

      expect(paginationService.calculateSkip).toHaveBeenCalledWith(1, 20);
      expect(paginationService.calculatePagination).toHaveBeenCalledWith(
        1,
        20,
        50,
      );
    });

    it('should use USER_CONTACT_SELECT', async () => {
      const mockOrder = createMockOrder();

      paginationService.calculateSkip.mockReturnValue(0);
      paginationService.calculatePagination.mockReturnValue({
        page: 1,
        limit: 20,
        total: 50,
        totalPages: 3,
      });
      prismaService.order.findMany.mockResolvedValue([mockOrder] as any);
      prismaService.order.count.mockResolvedValue(50);

      await service.getAllOrders(1, 20);

      const callArgs = prismaService.order.findMany.mock.calls[0][0];
      expect(callArgs.include.user.select).toEqual(USER_CONTACT_SELECT);
    });
  });

  describe('getDashboardStats', () => {
    it('should use USER_CONTACT_SELECT', async () => {
      const mockOrder = createMockOrder();
      const mockUser = createMockUser();

      prismaService.user.count.mockResolvedValue(100);
      prismaService.order.count.mockResolvedValue(50);
      prismaService.product.count.mockResolvedValue(200);
      prismaService.order.aggregate.mockResolvedValue({
        _sum: { total: new Prisma.Decimal('10000.00') },
      } as any);
      prismaService.order.findMany.mockResolvedValue([
        {
          ...mockOrder,
          user: {
            id: mockUser.id,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
          },
          items: [],
        },
      ] as any);

      await service.getDashboardStats();

      const callArgs = prismaService.order.findMany.mock.calls[0][0];
      expect(callArgs.include.user.select).toEqual(USER_CONTACT_SELECT);
    });
  });
});
