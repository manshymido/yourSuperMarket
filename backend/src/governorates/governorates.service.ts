import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GovernoratesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.governorate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
