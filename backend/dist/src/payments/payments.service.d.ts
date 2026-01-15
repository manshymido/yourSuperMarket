import { PrismaService } from '../common/prisma.service';
import { PaymentMethod, Prisma } from '@prisma/client';
export declare class PaymentsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createPayment(orderId: string, method: PaymentMethod): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        transactionId: string | null;
        amount: Prisma.Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        paymobOrderId: string | null;
        paidAt: Date | null;
    }>;
    private initiatePaymobPayment;
    handlePaymobCallback(data: unknown): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        transactionId: string | null;
        amount: Prisma.Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        paymobOrderId: string | null;
        paidAt: Date | null;
    }>;
}
