"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                addresses: {
                    orderBy: { isDefault: 'desc' },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateProfileDto.email },
            });
            if (existingUser) {
                throw new common_1.ForbiddenException('Email already in use');
            }
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateProfileDto,
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
    }
    async getAddresses(userId) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
    }
    async createAddress(userId, createAddressDto) {
        if (createAddressDto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.create({
            data: {
                ...createAddressDto,
                userId,
            },
        });
    }
    async updateAddress(userId, addressId, updateAddressDto) {
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own addresses');
        }
        if (updateAddressDto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, id: { not: addressId } },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.update({
            where: { id: addressId },
            data: updateAddressDto,
        });
    }
    async deleteAddress(userId, addressId) {
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own addresses');
        }
        await this.prisma.address.delete({
            where: { id: addressId },
        });
        return { message: 'Address deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map