import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    // Configure logging based on environment and PRISMA_LOG_LEVEL
    const logLevel = process.env.PRISMA_LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'warn' : 'error');
    
    super({
      adapter,
      log: this.getLogLevels(logLevel),
    });

    // Set up query event logging only if explicitly enabled
    if (process.env.PRISMA_LOG_QUERIES === 'true') {
      this.$on('query' as never, (e: any) => {
        this.logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
      });
    }
  }

  private getLogLevels(level: string): Array<'query' | 'info' | 'warn' | 'error'> {
    switch (level.toLowerCase()) {
      case 'query':
        return ['query', 'error', 'warn'];
      case 'info':
        return ['info', 'error', 'warn'];
      case 'warn':
        return ['warn', 'error'];
      case 'error':
      default:
        return ['error'];
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
