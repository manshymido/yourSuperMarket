import { PrismaService } from '../common/prisma.service';
export declare class InventoryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    updateInventory(productId: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lowStockThreshold: number;
        reserved: number;
        productId: string;
    }>;
    getLowStockItems(): Promise<({
        product: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            categoryId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            barcode: string | null;
            images: string[];
            isFeatured: boolean;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            unit: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        lowStockThreshold: number;
        reserved: number;
        productId: string;
    })[]>;
}
