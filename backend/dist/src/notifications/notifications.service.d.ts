import { PrismaService } from '../common/prisma.service';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    private transporter;
    constructor(prisma: PrismaService);
    createNotification(userId: string, title: string, message: string, type: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }[]>;
    markAsRead(userId: string, notificationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    sendEmail(to: string, subject: string, html: string): Promise<void>;
}
