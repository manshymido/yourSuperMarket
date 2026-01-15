import { PrismaService } from '../common/prisma.service';
import { ProductHelperService } from '../common/product-helper.service';
export declare class InventoryService {
    private prisma;
    private productHelperService;
    private readonly logger;
    constructor(prisma: PrismaService, productHelperService: ProductHelperService);
    updateInventory(productId: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        lowStockThreshold: number;
        reserved: number;
    }>;
    getLowStockItems(): Promise<({
        product: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            barcode: string | null;
            categoryId: string;
            images: string[];
            isActive: boolean;
            isFeatured: boolean;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            unit: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        lowStockThreshold: number;
        reserved: number;
    })[]>;
}
