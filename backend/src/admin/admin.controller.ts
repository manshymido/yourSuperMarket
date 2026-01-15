import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getAllUsers(@Query() pagination: PaginationDto) {
    return this.adminService.getAllUsers(pagination.page, pagination.limit);
  }

  @Get('orders')
  getAllOrders(@Query() pagination: PaginationDto) {
    return this.adminService.getAllOrders(pagination.page, pagination.limit);
  }
}
