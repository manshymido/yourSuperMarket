import { HealthCheckService } from '@nestjs/terminus';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';
export declare class AppController {
    private readonly appService;
    private health;
    private prisma;
    constructor(appService: AppService, health: HealthCheckService, prisma: PrismaService);
    getHello(): string;
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
