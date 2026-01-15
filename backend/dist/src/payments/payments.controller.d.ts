import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(orderId: string, createPaymentDto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        transactionId: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        paymobOrderId: string | null;
        paidAt: Date | null;
    }>;
    handlePaymobCallback(data: unknown): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        transactionId: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        paymobOrderId: string | null;
        paidAt: Date | null;
    }>;
}
