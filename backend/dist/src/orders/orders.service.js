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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const client_1 = require("@prisma/client");
const product_helper_service_1 = require("../common/product-helper.service");
const inventory_helper_service_1 = require("../common/inventory-helper.service");
const ownership_helper_service_1 = require("../common/ownership-helper.service");
const user_selectors_1 = require("../common/user-selectors");
const error_messages_1 = require("../common/error-messages");
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    productHelperService;
    inventoryHelperService;
    ownershipHelperService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, productHelperService, inventoryHelperService, ownershipHelperService) {
        this.prisma = prisma;
        this.productHelperService = productHelperService;
        this.inventoryHelperService = inventoryHelperService;
        this.ownershipHelperService = ownershipHelperService;
    }
    async create(userId, createOrderDto) {
        const { addressId, notes } = createOrderDto;
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }
        this.ownershipHelperService.verifyResourceOwnership(address, userId, 'address');
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                inventory: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.CART_EMPTY);
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.product;
            this.productHelperService.validateProductActive(product);
            this.inventoryHelperService.validateProductStock(product, item.quantity, product.name);
            const itemTotal = Number(product.price) * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }
        const governorate = await this.prisma.governorate.findFirst({
            where: { name: address.governorate, isActive: true },
        });
        const deliveryFee = governorate?.deliveryFee
            ? Number(governorate.deliveryFee)
            : 0;
        const taxRate = parseFloat(process.env.TAX_RATE || '0.14');
        const tax = subtotal * taxRate;
        const total = subtotal + deliveryFee + tax;
        const orderNumber = this.generateOrderNumber();
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    orderNumber,
                    status: client_1.OrderStatus.PENDING,
                    subtotal,
                    deliveryFee,
                    tax,
                    total,
                    notes,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    address: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            for (const item of cart.items) {
                await tx.inventory.update({
                    where: { productId: item.productId },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                        reserved: {
                            increment: item.quantity,
                        },
                    },
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return newOrder;
        });
        return order;
    }
    async findAll(userId, role) {
        const where = {};
        if (role === client_1.UserRole.CUSTOMER) {
            where.userId = userId;
        }
        return this.prisma.order.findMany({
            where,
            include: {
                address: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
                delivery: {
                    include: {
                        driver: {
                            select: user_selectors_1.USER_CONTACT_SELECT,
                        },
                        governorate: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, role) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: user_selectors_1.USER_CONTACT_SELECT,
                },
                address: true,
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                payment: true,
                delivery: {
                    include: {
                        driver: {
                            select: user_selectors_1.USER_CONTACT_SELECT,
                        },
                        governorate: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ORDER_NOT_FOUND);
        }
        if (role === client_1.UserRole.CUSTOMER && order.userId !== userId) {
            throw new common_1.ForbiddenException(error_messages_1.ERROR_MESSAGES.CAN_ONLY_VIEW_OWN_ORDERS);
        }
        return order;
    }
    async updateStatus(id, updateOrderStatusDto, userId, role) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (role !== client_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can update order status');
        }
        const { status } = updateOrderStatusDto;
        if (status === client_1.OrderStatus.CANCELLED &&
            order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.ONLY_PENDING_ORDERS_CAN_BE_CANCELLED);
        }
        if (status === client_1.OrderStatus.CANCELLED) {
            await this.restoreInventory(order.id);
        }
        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                address: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
                delivery: true,
            },
        });
    }
    async restoreInventory(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order)
            return;
        for (const item of order.items) {
            await this.prisma.inventory.update({
                where: { productId: item.productId },
                data: {
                    quantity: {
                        increment: item.quantity,
                    },
                    reserved: {
                        decrement: item.quantity,
                    },
                },
            });
        }
    }
    generateOrderNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        product_helper_service_1.ProductHelperService,
        inventory_helper_service_1.InventoryHelperService,
        ownership_helper_service_1.OwnershipHelperService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map