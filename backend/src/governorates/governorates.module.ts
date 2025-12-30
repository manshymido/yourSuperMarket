import { Module } from '@nestjs/common';
import { GovernoratesService } from './governorates.service';
import { GovernoratesController } from './governorates.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [GovernoratesController],
  providers: [GovernoratesService, PrismaService],
  exports: [GovernoratesService],
})
export class GovernoratesModule {}
