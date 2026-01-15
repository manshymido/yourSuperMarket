import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { DeliveryStatus, UserRole } from '@prisma/client';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('orders/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createDelivery(@Param('orderId') orderId: string) {
    return this.deliveryService.createDelivery(orderId);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  getAvailableDeliveries() {
    return this.deliveryService.getAvailableDeliveries();
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  acceptDelivery(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') deliveryId: string,
  ) {
    return this.deliveryService.acceptDelivery(user.id, deliveryId);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') deliveryId: string,
    @Body() body: { status: DeliveryStatus },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const driverId = user.role === UserRole.DRIVER ? user.id : undefined;
    return this.deliveryService.updateDeliveryStatus(
      deliveryId,
      body.status,
      driverId,
    );
  }

  @Get('driver/my-deliveries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  getDriverDeliveries(@CurrentUser() user: CurrentUserPayload) {
    return this.deliveryService.getDriverDeliveries(user.id);
  }
}
