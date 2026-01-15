import { PrismaService } from '../common/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { OwnershipHelperService } from '../common/ownership-helper.service';
export declare class UsersService {
    private prisma;
    private ownershipHelperService;
    constructor(prisma: PrismaService, ownershipHelperService: OwnershipHelperService);
    getProfile(userId: string): Promise<{
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
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
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
    }>;
    getAddresses(userId: string): Promise<{
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
    }[]>;
    createAddress(userId: string, createAddressDto: CreateAddressDto): Promise<{
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
    }>;
    updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto): Promise<{
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
    }>;
    deleteAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
}
