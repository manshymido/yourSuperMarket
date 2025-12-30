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
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let OrdersGateway = class OrdersGateway {
    jwtService;
    server;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        try {
            const authToken = client.handshake.auth.token;
            if (typeof authToken === 'string' && authToken) {
                const payload = this.jwtService.verify(authToken, {
                    secret: process.env.JWT_SECRET,
                });
                client.data.userId = payload.sub;
            }
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect() {
    }
    handleOrderSubscribe(client, orderId) {
        void client.join(`order:${orderId}`);
    }
    handleOrderUnsubscribe(client, orderId) {
        void client.leave(`order:${orderId}`);
    }
    emitOrderUpdate(orderId, data) {
        this.server.to(`order:${orderId}`).emit('order:update', data);
    }
    emitDeliveryUpdate(deliveryId, data) {
        this.server.to(`delivery:${deliveryId}`).emit('delivery:update', data);
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe:order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleOrderSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe:order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleOrderUnsubscribe", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3001',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map