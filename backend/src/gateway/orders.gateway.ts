import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
}

interface SocketData {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const authToken: unknown = client.handshake.auth.token;
      if (typeof authToken === 'string' && authToken) {
        const payload = this.jwtService.verify<JwtPayload>(authToken, {
          secret: process.env.JWT_SECRET as string,
        });
        (client.data as SocketData).userId = payload.sub;
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect() {
    // Handle disconnect
  }

  @SubscribeMessage('subscribe:order')
  handleOrderSubscribe(client: Socket, orderId: string) {
    void client.join(`order:${orderId}`);
  }

  @SubscribeMessage('unsubscribe:order')
  handleOrderUnsubscribe(client: Socket, orderId: string) {
    void client.leave(`order:${orderId}`);
  }

  emitOrderUpdate(orderId: string, data: unknown) {
    this.server.to(`order:${orderId}`).emit('order:update', data);
  }

  emitDeliveryUpdate(deliveryId: string, data: unknown) {
    this.server.to(`delivery:${deliveryId}`).emit('delivery:update', data);
  }
}
