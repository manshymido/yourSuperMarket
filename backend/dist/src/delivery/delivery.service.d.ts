import { PrismaService } from '../common/prisma.service';
import { DeliveryStatus } from '@prisma/client';
export declare class DeliveryService {
    private prisma;
    constructor(prisma: PrismaService);
    createDelivery(orderId: string): Promise<{
        order: {
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
        };
        governorate: {
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            nameAr: string | null;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        };
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
    }>;
    getAvailableDeliveries(): Promise<({
        order: {
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
        };
        governorate: {
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            nameAr: string | null;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        };
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
    })[]>;
    acceptDelivery(driverId: string, deliveryId: string): Promise<{
        order: {
            user: {
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
        };
        governorate: {
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            nameAr: string | null;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        };
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
    }>;
    updateDeliveryStatus(deliveryId: string, status: DeliveryStatus, driverId?: string): Promise<{
        order: {
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
        };
        governorate: {
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            nameAr: string | null;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        };
        driver: {
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
    }>;
    getDriverDeliveries(driverId: string): Promise<({
        order: {
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
        };
        governorate: {
            name: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            nameAr: string | null;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        };
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
    })[]>;
}
