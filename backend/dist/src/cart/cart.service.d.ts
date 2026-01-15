import { PrismaService } from '../common/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';
export declare class CartService {
    private prisma;
    private productHelperService;
    private inventoryHelperService;
    private ownershipHelperService;
    constructor(prisma: PrismaService, productHelperService: ProductHelperService, inventoryHelperService: InventoryHelperService, ownershipHelperService: OwnershipHelperService);
    getCart(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    description: string | null;
                    name: string;
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
                    image: string | null;
                    parentId: string | null;
                    slug: string;
                };
                inventory: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    quantity: number;
                    lowStockThreshold: number;
                    reserved: number;
                    productId: string;
                } | null;
            } & {
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
            productId: string;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
    }>;
    private getOrCreateCart;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        product: {
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            };
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                lowStockThreshold: number;
                reserved: number;
                productId: string;
            } | null;
        } & {
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
        productId: string;
        cartId: string;
    }>;
    updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        product: {
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            };
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                lowStockThreshold: number;
                reserved: number;
                productId: string;
            } | null;
        } & {
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
        productId: string;
        cartId: string;
    }>;
    removeFromCart(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
