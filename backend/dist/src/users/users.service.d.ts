import { PrismaService } from '../common/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        email: string | null;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
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
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        email: string | null;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
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
