import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaService } from '../common/prisma.service';
import { PaginationService } from '../common/pagination.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService, PaginationService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
