"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    logger = new common_1.Logger(LoggingInterceptor_1.name);
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const requestId = (0, uuid_1.v4)();
        request.id = requestId;
        const now = Date.now();
        const userAgent = request.get('user-agent') || '';
        const ip = request.ip || request.socket?.remoteAddress || 'unknown';
        this.logger.log(`[${requestId}] ${method} ${url} - ${ip} - ${userAgent}`);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;
                const responseTime = Date.now() - now;
                this.logger.log(`[${requestId}] ${method} ${url} ${statusCode} - ${responseTime}ms`);
            },
            error: (error) => {
                const responseTime = Date.now() - now;
                const errorMessage = error instanceof Error ? error.message : String(error);
                this.logger.error(`[${requestId}] ${method} ${url} ERROR - ${responseTime}ms - ${errorMessage}`);
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map