import { PrismaService } from '../common/prisma.service';
export declare class GovernoratesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        nameAr: string | null;
    }[]>;
}
