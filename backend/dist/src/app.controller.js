"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./common/prisma.service");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    appService;
    health;
    prisma;
    constructor(appService, health, prisma) {
        this.appService = appService;
        this.health = health;
        this.prisma = prisma;
    }
    getHello() {
        return this.appService.getHello();
    }
    async check() {
        return this.health.check([
            async () => {
                try {
                    await this.prisma.$queryRaw `SELECT 1`;
                    return {
                        database: {
                            status: 'up',
                            message: 'Database connection is healthy',
                        },
                    };
                }
                catch (error) {
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get API welcome message' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "check", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('health'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        terminus_1.HealthCheckService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map