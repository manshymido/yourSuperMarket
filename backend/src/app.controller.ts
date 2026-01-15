import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiTags('health')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async check() {
    return this.health.check([
      async () => {
        // Check database connection
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return {
            database: {
              status: 'up',
              message: 'Database connection is healthy',
            },
          };
        } catch (error) {
          return {
            database: {
              status: 'down',
              message: 'Database connection failed',
            },
          };
        }
      },
    ]);
  }
}
