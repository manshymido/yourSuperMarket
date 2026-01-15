import { PrismaService } from './prisma.service';
import { Product, Inventory } from '@prisma/client';
export interface ProductWithInventory extends Product {
    inventory?: Inventory | null;
}
export declare class InventoryHelperService {
    private prisma;
    constructor(prisma: PrismaService);
    validateProductStock(product: ProductWithInventory, requestedQuantity: number, productName?: string): void;
    getAvailableQuantity(product: ProductWithInventory): number;
}
