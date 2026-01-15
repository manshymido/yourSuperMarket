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
const ownership_helper_service_1 = require("../common/ownership-helper.service");
const user_selectors_1 = require("../common/user-selectors");
const error_messages_1 = require("../common/error-messages");
let UsersService = class UsersService {
    prisma;
    ownershipHelperService;
    constructor(prisma, ownershipHelperService) {
        this.prisma = prisma;
        this.ownershipHelperService = ownershipHelperService;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                ...user_selectors_1.USER_BASIC_SELECT,
                createdAt: true,
                updatedAt: true,
                addresses: {
                    orderBy: { isDefault: 'desc' },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateProfileDto.email },
            });
            if (existingUser) {
                throw new common_1.ForbiddenException(error_messages_1.ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
            }
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateProfileDto,
            select: user_selectors_1.USER_BASIC_SELECT,
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
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }
        this.ownershipHelperService.verifyResourceOwnership(address, userId, 'address');
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
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }
        this.ownershipHelperService.verifyResourceOwnership(address, userId, 'address');
        await this.prisma.address.delete({
            where: { id: addressId },
        });
        return { message: 'Address deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ownership_helper_service_1.OwnershipHelperService])
], UsersService);
//# sourceMappingURL=users.service.js.map