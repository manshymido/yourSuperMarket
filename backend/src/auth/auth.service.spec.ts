import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { USER_BASIC_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';
import { UserRole } from '@prisma/client';
import {
  createMockPrismaService,
  createMockUser,
} from '../common/test-utils';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

jest.mock('bcryptjs');
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let notificationsService: jest.Mocked<NotificationsService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };
    const mockNotificationsService = {
      sendEmail: jest.fn(),
    };

    (randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('random-hex-string'),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    notificationsService = module.get(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should use validateEmailOrPhone helper', async () => {
      const registerDto = {
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockUser = createMockUser();

      prismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...USER_BASIC_SELECT,
      } as any);
      jwtService.sign.mockReturnValue('token');
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-123',
        token: 'refresh-token',
        userId: 'user-123',
        expiresAt: new Date(),
        createdAt: new Date(),
      } as any);

      await service.register(registerDto);

      // Should not throw BadRequestException for email/phone validation
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should use USER_BASIC_SELECT', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockUser = createMockUser();

      prismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...USER_BASIC_SELECT,
      } as any);
      jwtService.sign.mockReturnValue('token');
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-123',
        token: 'refresh-token',
        userId: 'user-123',
        expiresAt: new Date(),
        createdAt: new Date(),
      } as any);

      await service.register(registerDto);

      const callArgs = prismaService.user.create.mock.calls[0][0];
      expect(callArgs.select).toEqual(USER_BASIC_SELECT);
    });

    it('should throw BadRequestException when neither email nor phone provided', async () => {
      const registerDto = {
        password: 'password123',
      };

      await expect(service.register(registerDto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto as any)).rejects.toThrow(
        ERROR_MESSAGES.EMAIL_OR_PHONE_REQUIRED,
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
      };
      const existingUser = createMockUser();

      prismaService.user.findUnique.mockResolvedValue(existingUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      );
    });
  });

  describe('login', () => {
    it('should use validateEmailOrPhone helper', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = createMockUser({ password: 'hashedPassword' });

      prismaService.user.findFirst.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');
      prismaService.refreshToken.create.mockResolvedValue({
        id: 'token-123',
        token: 'refresh-token',
        userId: 'user-123',
        expiresAt: new Date(),
        createdAt: new Date(),
      } as any);

      const result = await service.login(loginDto);
      expect(result).toBeDefined();
      expect(prismaService.user.findFirst).toHaveBeenCalled();
    });

    it('should throw BadRequestException when neither email nor phone provided', async () => {
      const loginDto = {
        password: 'password123',
      };

      await expect(service.login(loginDto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.login(loginDto as any)).rejects.toThrow(
        ERROR_MESSAGES.EMAIL_OR_PHONE_REQUIRED,
      );
    });

    it('should use ERROR_MESSAGES constants', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    });
  });
});
