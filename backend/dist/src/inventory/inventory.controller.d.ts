import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    updateInventory(productId: string, updateInventoryDto: UpdateInventoryDto): Promise<{
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
