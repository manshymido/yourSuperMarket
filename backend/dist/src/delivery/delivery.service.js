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
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const client_1 = require("@prisma/client");
const user_selectors_1 = require("../common/user-selectors");
const error_messages_1 = require("../common/error-messages");
let DeliveryService = class DeliveryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDelivery(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { address: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ORDER_NOT_FOUND);
        }
        const governorate = await this.prisma.governorate.findFirst({
            where: { name: order.address.governorate, isActive: true },
        });
        if (!governorate) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.GOVERNORATE_NOT_FOUND);
        }
        return this.prisma.delivery.create({
            data: {
                orderId,
                governorateId: governorate.id,
                status: client_1.DeliveryStatus.PENDING,
            },
            include: {
                order: true,
                governorate: true,
            },
        });
    }
    async getAvailableDeliveries() {
        return this.prisma.delivery.findMany({
            where: {
                status: client_1.DeliveryStatus.ASSIGNED,
                driverId: null,
                order: {
                    status: 'READY_FOR_DELIVERY',
                },
            },
            include: {
                order: {
                    include: {
                        address: true,
                        user: {
                            select: user_selectors_1.USER_CONTACT_SELECT,
                        },
                    },
                },
                governorate: true,
            },
        });
    }
    async acceptDelivery(driverId, deliveryId) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
        });
        if (!delivery) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.DELIVERY_NOT_FOUND);
        }
        if (delivery.driverId) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.DELIVERY_ALREADY_ASSIGNED);
        }
        return this.prisma.delivery.update({
            where: { id: deliveryId },
            data: {
                driverId,
                status: client_1.DeliveryStatus.ASSIGNED,
            },
            include: {
                order: {
                    include: {
                        address: true,
                        user: true,
                    },
                },
                governorate: true,
            },
        });
    }
    async updateDeliveryStatus(deliveryId, status, driverId) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id: deliveryId },
        });
        if (!delivery) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.DELIVERY_NOT_FOUND);
        }
        if (driverId && delivery.driverId !== driverId) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.DELIVERY_NOT_BELONGS_TO_DRIVER);
        }
        const updateData = {
            status,
        };
        if (status === client_1.DeliveryStatus.DELIVERED) {
            updateData.actualDeliveryTime = new Date();
        }
        return this.prisma.delivery.update({
            where: { id: deliveryId },
            data: updateData,
            include: {
                order: true,
                driver: true,
                governorate: true,
            },
        });
    }
    async getDriverDeliveries(driverId) {
        return this.prisma.delivery.findMany({
            where: { driverId },
            include: {
                order: {
                    include: {
                        address: true,
                        user: {
                            select: user_selectors_1.USER_CONTACT_SELECT,
                        },
                    },
                },
                governorate: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map