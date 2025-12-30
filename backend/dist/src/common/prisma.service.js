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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    constructor() {
        const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        const logLevel = process.env.PRISMA_LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'warn' : 'error');
        super({
            adapter,
            log: this.getLogLevels(logLevel),
        });
        if (process.env.PRISMA_LOG_QUERIES === 'true') {
            this.$on('query', (e) => {
                this.logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
            });
        }
    }
    getLogLevels(level) {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map