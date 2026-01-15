import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/prisma.service';
interface JwtPayload {
    sub: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        email: string | null;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
}
export {};
