import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UserRole, Prisma } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
                categoryId: string;
                price: Prisma.Decimal;
                compareAtPrice: Prisma.Decimal | null;
                sku: string | null;
                barcode: string | null;
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
            amount: Prisma.Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
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
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                id: string;
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
                categoryId: string;
                price: Prisma.Decimal;
                compareAtPrice: Prisma.Decimal | null;
                sku: string | null;
                barcode: string | null;
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
            email: string | null;
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: Prisma.Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
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
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                id: string;
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
                categoryId: string;
                price: Prisma.Decimal;
                compareAtPrice: Prisma.Decimal | null;
                sku: string | null;
                barcode: string | null;
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
            amount: Prisma.Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            paymobOrderId: string | null;
            paidAt: Date | null;
        } | null;
        delivery: {
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
                categoryId: string;
                price: Prisma.Decimal;
                compareAtPrice: Prisma.Decimal | null;
                sku: string | null;
                barcode: string | null;
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
