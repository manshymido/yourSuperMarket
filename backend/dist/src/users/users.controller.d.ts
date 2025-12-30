import { UsersService } from './users.service';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: CurrentUserPayload): Promise<{
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
    updateProfile(user: CurrentUserPayload, updateProfileDto: UpdateProfileDto): Promise<{
        email: string | null;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    getAddresses(user: CurrentUserPayload): Promise<{
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
    createAddress(user: CurrentUserPayload, createAddressDto: CreateAddressDto): Promise<{
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
    updateAddress(user: CurrentUserPayload, addressId: string, updateAddressDto: UpdateAddressDto): Promise<{
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
    deleteAddress(user: CurrentUserPayload, addressId: string): Promise<{
        message: string;
    }>;
}
