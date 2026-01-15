import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../common/prisma.service';
import { PaginationService } from '../common/pagination.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, PaginationService],
  exports: [AdminService],
})
export class AdminModule {}
