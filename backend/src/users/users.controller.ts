import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get('addresses')
  getAddresses(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getAddresses(user.id);
  }

  @Post('addresses')
  createAddress(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.usersService.createAddress(user.id, createAddressDto);
  }

  @Put('addresses/:id')
  updateAddress(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(
      user.id,
      addressId,
      updateAddressDto,
    );
  }

  @Delete('addresses/:id')
  deleteAddress(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') addressId: string,
  ) {
    return this.usersService.deleteAddress(user.id, addressId);
  }
}
