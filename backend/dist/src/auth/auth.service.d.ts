import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, notificationsService: NotificationsService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            email: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    requestPasswordReset(requestResetPasswordDto: RequestResetPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private validateEmailOrPhone;
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    cleanupExpiredResetTokens(): Promise<number>;
}
