import { PrismaService } from '../common/prisma.service';
export declare class GovernoratesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        nameAr: string | null;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
}
