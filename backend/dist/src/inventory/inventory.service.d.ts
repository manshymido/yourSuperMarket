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
            price: import("@prisma/client-runtime-utils").Decimal;
            compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
            sku: string | null;
            barcode: string | null;
            categoryId: string;
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
