import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { OwnershipHelperService } from '../common/ownership-helper.service';
import { USER_BASIC_SELECT } from '../common/user-selectors';
import { ERROR_MESSAGES } from '../common/error-messages';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private ownershipHelperService: OwnershipHelperService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...USER_BASIC_SELECT,
        createdAt: true,
        updatedAt: true,
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if email is being changed and if it's already taken
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateProfileDto.email },
      });

      if (existingUser) {
        throw new ForbiddenException(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
      select: USER_BASIC_SELECT,
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    // If this is set as default, unset other defaults
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

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
    }

    this.ownershipHelperService.verifyResourceOwnership(
      address,
      userId,
      'address',
    );

    // If setting as default, unset other defaults
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

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
    }

    this.ownershipHelperService.verifyResourceOwnership(
      address,
      userId,
      'address',
    );

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }
}
