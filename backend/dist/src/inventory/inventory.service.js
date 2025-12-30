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
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let InventoryService = InventoryService_1 = class InventoryService {
    prisma;
    logger = new common_1.Logger(InventoryService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateInventory(productId, quantity) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { inventory: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.inventory) {
            this.logger.log(`Creating inventory for product ${productId}`);
            return this.prisma.inventory.create({
                data: {
                    productId,
                    quantity,
                },
            });
        }
        return this.prisma.inventory.update({
            where: { productId },
            data: { quantity },
        });
    }
    async getLowStockItems() {
        const inventories = await this.prisma.inventory.findMany({
            include: {
                product: true,
            },
        });
        return inventories.filter((inventory) => inventory.quantity <= inventory.lowStockThreshold);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map