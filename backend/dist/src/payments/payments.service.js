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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPayment(orderId, method) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const existingPayment = await this.prisma.payment.findUnique({
            where: { orderId },
        });
        if (existingPayment) {
            return existingPayment;
        }
        if (method === client_1.PaymentMethod.CASH_ON_DELIVERY) {
            return this.prisma.payment.create({
                data: {
                    orderId,
                    amount: order.total,
                    method: client_1.PaymentMethod.CASH_ON_DELIVERY,
                    status: client_1.PaymentStatus.PENDING,
                },
            });
        }
        if (method === client_1.PaymentMethod.PAYMOB) {
            return this.initiatePaymobPayment(order);
        }
        throw new common_1.BadRequestException('Invalid payment method');
    }
    async initiatePaymobPayment(order) {
        try {
            const authResponse = await axios_1.default.post('https://accept.paymob.com/api/auth/tokens', {
                api_key: process.env.PAYMOB_API_KEY,
            });
            const authToken = authResponse.data.token;
            const totalAmount = Number(order.total);
            const orderResponse = await axios_1.default.post('https://accept.paymob.com/api/ecommerce/orders', {
                auth_token: authToken,
                delivery_needed: 'false',
                amount_cents: Math.round(totalAmount * 100),
                currency: 'EGP',
                items: [],
            });
            const paymobOrderId = orderResponse.data.id;
            const paymentKeyResponse = await axios_1.default.post('https://accept.paymob.com/api/acceptance/payment_keys', {
                auth_token: authToken,
                amount_cents: Math.round(totalAmount * 100),
                expiration: 3600,
                order_id: paymobOrderId,
                billing_data: {
                    apartment: 'NA',
                    email: 'customer@example.com',
                    floor: 'NA',
                    first_name: 'Customer',
                    street: 'NA',
                    building: 'NA',
                    phone_number: '01000000000',
                    shipping_method: 'NA',
                    postal_code: 'NA',
                    city: 'NA',
                    country: 'EG',
                    last_name: 'Customer',
                    state: 'NA',
                },
                currency: 'EGP',
                integration_id: process.env.PAYMOB_INTEGRATION_ID,
            });
            const paymentKey = paymentKeyResponse.data.token;
            const payment = await this.prisma.payment.create({
                data: {
                    orderId: order.id,
                    amount: order.total,
                    method: client_1.PaymentMethod.PAYMOB,
                    status: client_1.PaymentStatus.PENDING,
                    paymobOrderId: paymobOrderId.toString(),
                },
            });
            return {
                ...payment,
                paymentKey,
                iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_INTEGRATION_ID}?payment_token=${paymentKey}`,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Paymob payment initiation failed: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException(`Paymob payment initiation failed: ${errorMessage}`);
        }
    }
    async handlePaymobCallback(data) {
        const callbackData = data;
        const { obj } = callbackData;
        const orderId = String(obj.order.id);
        const payment = await this.prisma.payment.findFirst({
            where: { paymobOrderId: orderId },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        let status = client_1.PaymentStatus.PENDING;
        if (obj.success) {
            status = client_1.PaymentStatus.COMPLETED;
        }
        else {
            status = client_1.PaymentStatus.FAILED;
        }
        const transactionId = obj.id ? String(obj.id) : null;
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status,
                transactionId,
                paidAt: status === client_1.PaymentStatus.COMPLETED ? new Date() : null,
            },
        });
        if (status === client_1.PaymentStatus.COMPLETED) {
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'CONFIRMED' },
            });
        }
        return updatedPayment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map