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
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    image: string | null;
                    parentId: string | null;
                };
                inventory: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: string;
                    quantity: number;
                    lowStockThreshold: number;
                    reserved: number;
                } | null;
            } & {
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
            cartId: string;
            productId: string;
            quantity: number;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    private getOrCreateCart;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        product: {
            category: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
            };
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                lowStockThreshold: number;
                reserved: number;
            } | null;
        } & {
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
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        product: {
            category: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
            };
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                lowStockThreshold: number;
                reserved: number;
            } | null;
        } & {
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
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    removeFromCart(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
