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
exports.InventoryHelperService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const error_messages_1 = require("./error-messages");
let InventoryHelperService = class InventoryHelperService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    validateProductStock(product, requestedQuantity, productName) {
        const availableQuantity = product.inventory?.quantity || 0;
        if (availableQuantity < requestedQuantity) {
            const name = productName || product.name;
            throw new common_1.BadRequestException(`${error_messages_1.ERROR_MESSAGES.INSUFFICIENT_STOCK} for ${name}. Available: ${availableQuantity}`);
        }
    }
    getAvailableQuantity(product) {
        return product.inventory?.quantity || 0;
    }
};
exports.InventoryHelperService = InventoryHelperService;
exports.InventoryHelperService = InventoryHelperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryHelperService);
//# sourceMappingURL=inventory-helper.service.js.map