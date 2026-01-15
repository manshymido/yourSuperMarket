import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UserRole, Prisma } from '@prisma/client';
import { ProductHelperService } from '../common/product-helper.service';
import { InventoryHelperService } from '../common/inventory-helper.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';
export declare class OrdersService {
    private prisma;
    private productHelperService;
    private inventoryHelperService;
    private ownershipHelperService;
    private readonly logger;
    constructor(prisma: PrismaService, productHelperService: ProductHelperService, inventoryHelperService: InventoryHelperService, ownershipHelperService: OwnershipHelperService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<{
        address: {
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
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            price: Prisma.Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
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
    }>;
    findAll(userId: string, role: UserRole): Promise<({
        address: {
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
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            amount: Prisma.Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paymobOrderId: string | null;
            paidAt: Date | null;
        } | null;
        delivery: ({
            governorate: {
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                nameAr: string | null;
                deliveryFee: Prisma.Decimal;
            };
            driver: {
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
            } | null;
        } & {
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
        }) | null;
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            price: Prisma.Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
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
    })[]>;
    findOne(id: string, userId: string, role: UserRole): Promise<{
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
        address: {
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
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            amount: Prisma.Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paymobOrderId: string | null;
            paidAt: Date | null;
        } | null;
        delivery: ({
            governorate: {
                name: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                nameAr: string | null;
                deliveryFee: Prisma.Decimal;
            };
            driver: {
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
            } | null;
        } & {
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
        }) | null;
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
            };
        } & {
            id: string;
            createdAt: Date;
            price: Prisma.Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
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
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, userId: string, role: UserRole): Promise<{
        address: {
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
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            amount: Prisma.Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            paymobOrderId: string | null;
            paidAt: Date | null;
        } | null;
        delivery: {
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
        } | null;
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            price: Prisma.Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
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
    }>;
    private restoreInventory;
    private generateOrderNumber;
}
