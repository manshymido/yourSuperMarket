import { GovernoratesService } from './governorates.service';
export declare class GovernoratesController {
    private readonly governoratesService;
    constructor(governoratesService: GovernoratesService);
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
