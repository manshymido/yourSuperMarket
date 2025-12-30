import { Module } from '@nestjs/common';
import { OrdersGateway } from './orders.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [OrdersGateway],
  exports: [OrdersGateway],
})
export class GatewayModule {}
