import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): void;
    handleDisconnect(): void;
    handleOrderSubscribe(client: Socket, orderId: string): void;
    handleOrderUnsubscribe(client: Socket, orderId: string): void;
    emitOrderUpdate(orderId: string, data: unknown): void;
    emitDeliveryUpdate(deliveryId: string, data: unknown): void;
}
