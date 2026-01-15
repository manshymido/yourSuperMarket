import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../common/prisma.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';
import { USER_BASIC_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';
import {
  createMockPrismaService,
  createMockUser,
  createMockAddress,
} from '../common/test-utils';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;
  let ownershipHelperService: jest.Mocked<OwnershipHelperService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockOwnershipHelper = {
      verifyResourceOwnership: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: OwnershipHelperService,
          useValue: mockOwnershipHelper,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
    ownershipHelperService = module.get(OwnershipHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateAddress', () => {
    it('should use OwnershipHelperService', async () => {
      const mockAddress = createMockAddress({ userId: 'user-123' });

      prismaService.address.findUnique.mockResolvedValue(mockAddress as any);
      prismaService.address.updateMany.mockResolvedValue({ count: 0 });
      prismaService.address.update.mockResolvedValue(mockAddress as any);

      await service.updateAddress('user-123', 'address-123', {
        street: 'New Street',
      });

      expect(ownershipHelperService.verifyResourceOwnership).toHaveBeenCalledWith(
        mockAddress,
        'user-123',
        'address',
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.address.findUnique.mockResolvedValue(null);

      await expect(
        service.updateAddress('user-123', 'non-existent', {}),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateAddress('user-123', 'non-existent', {}),
      ).rejects.toThrow(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
    });
  });

  describe('deleteAddress', () => {
    it('should use OwnershipHelperService', async () => {
      const mockAddress = createMockAddress({ userId: 'user-123' });

      prismaService.address.findUnique.mockResolvedValue(mockAddress as any);
      prismaService.address.delete.mockResolvedValue(mockAddress as any);

      await service.deleteAddress('user-123', 'address-123');

      expect(ownershipHelperService.verifyResourceOwnership).toHaveBeenCalledWith(
        mockAddress,
        'user-123',
        'address',
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.address.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteAddress('user-123', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.deleteAddress('user-123', 'non-existent'),
      ).rejects.toThrow(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
    });
  });

  describe('getProfile', () => {
    it('should use USER_BASIC_SELECT', async () => {
      const mockUser = createMockUser();

      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        ...USER_BASIC_SELECT,
        createdAt: new Date(),
        updatedAt: new Date(),
        addresses: [],
      } as any);

      await service.getProfile('user-123');

      const callArgs = prismaService.user.findUnique.mock.calls[0][0];
      expect(callArgs.select).toMatchObject(USER_BASIC_SELECT);
      expect(callArgs.select.createdAt).toBe(true);
      expect(callArgs.select.updatedAt).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('should use USER_BASIC_SELECT', async () => {
      const mockUser = createMockUser();

      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      prismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...USER_BASIC_SELECT,
      } as any);

      await service.updateProfile('user-123', { firstName: 'Updated' });

      const callArgs = prismaService.user.update.mock.calls[0][0];
      expect(callArgs.select).toEqual(USER_BASIC_SELECT);
    });

    it('should use ERROR_MESSAGES constants', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile('non-existent', {}),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateProfile('non-existent', {}),
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });
  });
});
