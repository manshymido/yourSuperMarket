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
exports.ProductHelperService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const error_messages_1 = require("./error-messages");
let ProductHelperService = class ProductHelperService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateProductExists(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        }
        return product;
    }
    async validateProductExistsAndActive(productId) {
        const product = await this.validateProductExists(productId);
        this.validateProductActive(product);
        return product;
    }
    validateProductActive(product) {
        if (!product.isActive) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
        }
    }
};
exports.ProductHelperService = ProductHelperService;
exports.ProductHelperService = ProductHelperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductHelperService);
//# sourceMappingURL=product-helper.service.js.map