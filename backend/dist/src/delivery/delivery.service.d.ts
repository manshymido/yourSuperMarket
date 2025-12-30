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
        driverId: string | null;
        governorateId: string;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
        driverNotes: string | null;
        customerNotes: string | null;
    }>;
    getAvailableDeliveries(): Promise<({
        order: {
            user: {
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                id: string;
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
        driverId: string | null;
        governorateId: string;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
        driverNotes: string | null;
        customerNotes: string | null;
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
        driverId: string | null;
        governorateId: string;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
        driverNotes: string | null;
        customerNotes: string | null;
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
        driverId: string | null;
        governorateId: string;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
        driverNotes: string | null;
        customerNotes: string | null;
    }>;
    getDriverDeliveries(driverId: string): Promise<({
        order: {
            user: {
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                id: string;
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
        driverId: string | null;
        governorateId: string;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
        driverNotes: string | null;
        customerNotes: string | null;
    })[]>;
}
