import { PrismaService } from '../common/prisma.service';
import { PaginationService } from '../common/pagination.service';
export declare class AdminService {
    private prisma;
    private paginationService;
    constructor(prisma: PrismaService, paginationService: PaginationService);
    getDashboardStats(): Promise<{
        stats: {
            totalUsers: number;
            totalOrders: number;
            totalProducts: number;
            totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        };
        recentOrders: ({
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
                    total: import("@prisma/client-runtime-utils").Decimal;
                    addressId: string;
                    notes: string | null;
                    status: import("@prisma/client").$Enums.OrderStatus;
                    deliveryFee: import("@prisma/client-runtime-utils").Decimal;
                    orderNumber: string;
                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                    tax: import("@prisma/client-runtime-utils").Decimal;
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
            items: ({
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
                price: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                productId: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            addressId: string;
            notes: string | null;
            status: import("@prisma/client").$Enums.OrderStatus;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
            orderNumber: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
        })[];
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        users: {
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
                total: import("@prisma/client-runtime-utils").Decimal;
                addressId: string;
                notes: string | null;
                status: import("@prisma/client").$Enums.OrderStatus;
                deliveryFee: import("@prisma/client-runtime-utils").Decimal;
                orderNumber: string;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
                tax: import("@prisma/client-runtime-utils").Decimal;
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
        }[];
        pagination: import("../common/pagination.service").PaginationResult;
    }>;
    getAllOrders(page?: number, limit?: number): Promise<{
        orders: ({
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
                    total: import("@prisma/client-runtime-utils").Decimal;
                    addressId: string;
                    notes: string | null;
                    status: import("@prisma/client").$Enums.OrderStatus;
                    deliveryFee: import("@prisma/client-runtime-utils").Decimal;
                    orderNumber: string;
                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                    tax: import("@prisma/client-runtime-utils").Decimal;
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
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                orderId: string;
                transactionId: string | null;
                amount: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                quantity: number;
                productId: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            total: import("@prisma/client-runtime-utils").Decimal;
            addressId: string;
            notes: string | null;
            status: import("@prisma/client").$Enums.OrderStatus;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
            orderNumber: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
        })[];
        pagination: import("../common/pagination.service").PaginationResult;
    }>;
}
