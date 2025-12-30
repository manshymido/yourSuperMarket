import { AdminService } from './admin.service';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        stats: {
            totalUsers: number;
            totalOrders: number;
            totalProducts: number;
            totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        };
        recentOrders: ({
            user: {
                email: string | null;
                firstName: string | null;
                lastName: string | null;
                id: string;
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
        })[];
    }>;
    getAllUsers(pagination: PaginationDto): Promise<{
        users: {
            email: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllOrders(pagination: PaginationDto): Promise<{
        orders: ({
            user: {
                email: string | null;
                firstName: string | null;
                lastName: string | null;
                id: string;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
