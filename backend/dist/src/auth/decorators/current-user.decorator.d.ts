import { UserRole } from '@prisma/client';
export interface CurrentUserPayload {
    id: string;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    isActive: boolean;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
