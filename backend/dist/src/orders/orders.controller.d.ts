import { OrdersService } from './orders.service';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: CurrentUserPayload, createOrderDto: CreateOrderDto): Promise<{
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
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                sku: string | null;
                barcode: string | null;
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
    }>;
    findAll(user: CurrentUserPayload): Promise<({
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
            amount: import("@prisma/client-runtime-utils").Decimal;
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
                deliveryFee: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                sku: string | null;
                barcode: string | null;
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
    })[]>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
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
            amount: import("@prisma/client-runtime-utils").Decimal;
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
                deliveryFee: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                sku: string | null;
                barcode: string | null;
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
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, user: CurrentUserPayload): Promise<{
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
            amount: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                compareAtPrice: import("@prisma/client-runtime-utils").Decimal | null;
                sku: string | null;
                barcode: string | null;
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
    }>;
}
