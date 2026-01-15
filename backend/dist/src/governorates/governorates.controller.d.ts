import { GovernoratesService } from './governorates.service';
export declare class GovernoratesController {
    private readonly governoratesService;
    constructor(governoratesService: GovernoratesService);
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
