import { PrismaService } from './prisma.service';
import { Product } from '@prisma/client';
export declare class ProductHelperService {
    private prisma;
    constructor(prisma: PrismaService);
    validateProductExists(productId: string): Promise<Product>;
    validateProductExistsAndActive(productId: string): Promise<Product>;
    validateProductActive(product: Product): void;
}
