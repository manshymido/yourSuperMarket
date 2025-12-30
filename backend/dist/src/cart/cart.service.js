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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                inventory: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    category: true,
                                    inventory: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        const validItems = cart.items.filter((item) => {
            const product = item.product;
            return (product.isActive && (product.inventory?.quantity || 0) >= item.quantity);
        });
        return {
            ...cart,
            items: validItems,
        };
    }
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { inventory: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException('Product is not available');
        }
        const availableQuantity = product.inventory?.quantity || 0;
        if (availableQuantity < quantity) {
            throw new common_1.BadRequestException(`Only ${availableQuantity} items available in stock`);
        }
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
            });
        }
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (availableQuantity < newQuantity) {
                throw new common_1.BadRequestException(`Only ${availableQuantity} items available in stock`);
            }
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: {
                    product: {
                        include: {
                            category: true,
                            inventory: true,
                        },
                    },
                },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
            include: {
                product: {
                    include: {
                        category: true,
                        inventory: true,
                    },
                },
            },
        });
    }
    async updateCartItem(userId, itemId, updateCartItemDto) {
        const { quantity } = updateCartItemDto;
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: {
                    include: { inventory: true },
                },
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Cart item does not belong to user');
        }
        const availableQuantity = cartItem.product.inventory?.quantity || 0;
        if (availableQuantity < quantity) {
            throw new common_1.BadRequestException(`Only ${availableQuantity} items available in stock`);
        }
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: {
                product: {
                    include: {
                        category: true,
                        inventory: true,
                    },
                },
            },
        });
    }
    async removeFromCart(userId, itemId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Cart item does not belong to user');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return { message: 'Item removed from cart' };
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            return { message: 'Cart is already empty' };
        }
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return { message: 'Cart cleared' };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map