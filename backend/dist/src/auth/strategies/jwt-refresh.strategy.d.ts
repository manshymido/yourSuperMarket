import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/prisma.service';
interface JwtRefreshPayload {
    sub: string;
    jti: string;
}
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtRefreshPayload): Promise<{
        email: string | null;
        phone: string | null;
        password: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        updatedAt: Date;
    }>;
}
export {};
