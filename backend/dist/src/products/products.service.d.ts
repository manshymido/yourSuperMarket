import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CloudinaryService } from '../common/cloudinary.service';
import { SlugService } from '../common/slug.service';
import { PaginationService } from '../common/pagination.service';
import { ProductHelperService } from '../common/product-helper.service';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    private cloudinaryService;
    private slugService;
    private paginationService;
    private productHelperService;
    private readonly logger;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService, slugService: SlugService, paginationService: PaginationService, productHelperService: ProductHelperService);
    create(createProductDto: CreateProductDto, files?: Express.Multer.File[]): Promise<{
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
        _count: {
            reviews: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        categoryId: string;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        products: ({
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
            _count: {
                reviews: number;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            slug: string;
            price: Prisma.Decimal;
            compareAtPrice: Prisma.Decimal | null;
            sku: string | null;
            barcode: string | null;
            categoryId: string;
            images: string[];
            isFeatured: boolean;
            weight: Prisma.Decimal | null;
            unit: string | null;
        })[];
        pagination: import("../common/pagination.service").PaginationResult;
    }>;
    findOne(id: string): Promise<{
        category: {
            parent: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            } | null;
        } & {
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
        reviews: ({
            user: {
                cart: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                } | null;
                email: string | null;
                phone: string | null;
                password: string;
                firstName: string | null;
                lastName: string | null;
                id: string;
                createdAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
                isActive: boolean;
                emailVerified: boolean;
                phoneVerified: boolean;
                updatedAt: Date;
                addresses: {
                    governorate: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                    label: string | null;
                    street: string;
                    city: string;
                    postalCode: string | null;
                    isDefault: boolean;
                }[];
                orders: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                    total: Prisma.Decimal;
                    addressId: string;
                    notes: string | null;
                    status: import("@prisma/client").$Enums.OrderStatus;
                    deliveryFee: Prisma.Decimal;
                    orderNumber: string;
                    subtotal: Prisma.Decimal;
                    tax: Prisma.Decimal;
                }[];
                reviews: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                    productId: string;
                    isApproved: boolean;
                    rating: number;
                    comment: string | null;
                }[];
                deliveries: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    status: import("@prisma/client").$Enums.DeliveryStatus;
                    orderId: string;
                    estimatedDeliveryTime: Date | null;
                    actualDeliveryTime: Date | null;
                    driverNotes: string | null;
                    customerNotes: string | null;
                    driverId: string | null;
                    governorateId: string;
                }[];
                notifications: {
                    message: string;
                    id: string;
                    title: string;
                    type: string;
                    isRead: boolean;
                    createdAt: Date;
                    userId: string;
                }[];
                refreshTokens: {
                    token: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    expiresAt: Date;
                }[];
                passwordResetTokens: {
                    token: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    expiresAt: Date;
                    used: boolean;
                }[];
                _count: {
                    addresses: number;
                    cart: number;
                    orders: number;
                    reviews: number;
                    deliveries: number;
                    notifications: number;
                    refreshTokens: number;
                    passwordResetTokens: number;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            productId: string;
            isApproved: boolean;
            rating: number;
            comment: string | null;
        })[];
        _count: {
            reviews: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        categoryId: string;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            parent: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                image: string | null;
                parentId: string | null;
                slug: string;
            } | null;
        } & {
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
        reviews: ({
            user: {
                cart: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                } | null;
                email: string | null;
                phone: string | null;
                password: string;
                firstName: string | null;
                lastName: string | null;
                id: string;
                createdAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
                isActive: boolean;
                emailVerified: boolean;
                phoneVerified: boolean;
                updatedAt: Date;
                addresses: {
                    governorate: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                    label: string | null;
                    street: string;
                    city: string;
                    postalCode: string | null;
                    isDefault: boolean;
                }[];
                orders: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                    total: Prisma.Decimal;
                    addressId: string;
                    notes: string | null;
                    status: import("@prisma/client").$Enums.OrderStatus;
                    deliveryFee: Prisma.Decimal;
                    orderNumber: string;
                    subtotal: Prisma.Decimal;
                    tax: Prisma.Decimal;
                }[];
                reviews: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    updatedAt: Date;
                    productId: string;
                    isApproved: boolean;
                    rating: number;
                    comment: string | null;
                }[];
                deliveries: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    status: import("@prisma/client").$Enums.DeliveryStatus;
                    orderId: string;
                    estimatedDeliveryTime: Date | null;
                    actualDeliveryTime: Date | null;
                    driverNotes: string | null;
                    customerNotes: string | null;
                    driverId: string | null;
                    governorateId: string;
                }[];
                notifications: {
                    message: string;
                    id: string;
                    title: string;
                    type: string;
                    isRead: boolean;
                    createdAt: Date;
                    userId: string;
                }[];
                refreshTokens: {
                    token: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    expiresAt: Date;
                }[];
                passwordResetTokens: {
                    token: string;
                    id: string;
                    createdAt: Date;
                    userId: string;
                    expiresAt: Date;
                    used: boolean;
                }[];
                _count: {
                    addresses: number;
                    cart: number;
                    orders: number;
                    reviews: number;
                    deliveries: number;
                    notifications: number;
                    refreshTokens: number;
                    passwordResetTokens: number;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            productId: string;
            isApproved: boolean;
            rating: number;
            comment: string | null;
        })[];
        _count: {
            reviews: number;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        categoryId: string;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    private findProductWithDetails;
    update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<{
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
        price: Prisma.Decimal;
        compareAtPrice: Prisma.Decimal | null;
        sku: string | null;
        barcode: string | null;
        categoryId: string;
        images: string[];
        isFeatured: boolean;
        weight: Prisma.Decimal | null;
        unit: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
