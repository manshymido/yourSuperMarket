import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../common/prisma.service';
import { OwnershipHelperService } from '../common/ownership-helper.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, OwnershipHelperService],
  exports: [UsersService],
})
export class UsersModule {}
