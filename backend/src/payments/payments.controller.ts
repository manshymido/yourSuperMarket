import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders/:orderId')
  @UseGuards(JwtAuthGuard)
  createPayment(
    @Param('orderId') orderId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(orderId, createPaymentDto.method);
  }

  @Post('paymob/callback')
  handlePaymobCallback(@Body() data: unknown) {
    return this.paymentsService.handlePaymobCallback(data);
  }
}
