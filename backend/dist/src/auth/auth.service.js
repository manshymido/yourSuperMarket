"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../common/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const crypto_1 = require("crypto");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    notificationsService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, notificationsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    async register(registerDto) {
        const { email, phone, password, firstName, lastName } = registerDto;
        if (!email && !phone) {
            throw new common_1.BadRequestException('Either email or phone is required');
        }
        if (email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        if (phone) {
            const existingUser = await this.prisma.user.findUnique({
                where: { phone },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User with this phone already exists');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                phone,
                password: hashedPassword,
                firstName,
                lastName,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        const tokens = await this.generateTokens(user.id);
        return {
            user,
            ...tokens,
        };
    }
    async login(loginDto) {
        const { email, phone, password } = loginDto;
        if (!email && !phone) {
            throw new common_1.BadRequestException('Either email or phone is required');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [email ? { email } : {}, phone ? { phone } : {}],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }
    async refreshToken(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const tokenRecord = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
                include: { user: true },
            });
            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            if (!tokenRecord.user.isActive) {
                throw new common_1.UnauthorizedException('User is inactive');
            }
            await this.prisma.refreshToken.delete({
                where: { token: refreshToken },
            });
            const tokens = await this.generateTokens(tokenRecord.user.id);
            return tokens;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async requestPasswordReset(requestResetPasswordDto) {
        const { email } = requestResetPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                message: 'If the email exists, a password reset link has been sent',
            };
        }
        await this.prisma.passwordResetToken.updateMany({
            where: {
                userId: user.id,
                used: false,
            },
            data: {
                used: true,
            },
        });
        const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        await this.prisma.passwordResetToken.create({
            data: {
                token: resetToken,
                userId: user.id,
                expiresAt: resetTokenExpiry,
            },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
        const emailSubject = 'Password Reset Request';
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName || 'User'},</p>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>YourSuperMarket Team</p>
      </div>
    `;
        try {
            if (user.email) {
                await this.notificationsService.sendEmail(user.email, emailSubject, emailHtml);
                this.logger.log(`Password reset email sent to ${user.email}`);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to send password reset email to ${user.email}`, errorMessage);
        }
        return {
            message: 'If the email exists, a password reset link has been sent',
        };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (resetToken.used) {
            throw new common_1.BadRequestException('This reset token has already been used');
        }
        if (resetToken.expiresAt < new Date()) {
            await this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            });
            throw new common_1.BadRequestException('Reset token has expired. Please request a new one.');
        }
        if (!resetToken.user.isActive) {
            throw new common_1.BadRequestException('User account is inactive');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            });
            await tx.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            });
        });
        const emailSubject = 'Password Reset Successful';
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Successful</h2>
        <p>Hello ${resetToken.user.firstName || 'User'},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
        <p>Best regards,<br>YourSuperMarket Team</p>
      </div>
    `;
        try {
            if (resetToken.user.email) {
                await this.notificationsService.sendEmail(resetToken.user.email, emailSubject, emailHtml);
                this.logger.log(`Password reset confirmation email sent to ${resetToken.user.email}`);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to send password reset confirmation email to ${resetToken.user.email}`, errorMessage);
        }
        return { message: 'Password reset successfully' };
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
                token: refreshToken,
            },
        });
        return { message: 'Logged out successfully' };
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        });
        const refreshToken = this.jwtService.sign({ sub: userId, jti: (0, crypto_1.randomBytes)(16).toString('hex') }, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async cleanupExpiredResetTokens() {
        const deleted = await this.prisma.passwordResetToken.deleteMany({
            where: {
                OR: [{ expiresAt: { lt: new Date() } }, { used: true }],
            },
        });
        this.logger.log(`Cleaned up ${deleted.count} expired/used password reset tokens`);
        return deleted.count;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map