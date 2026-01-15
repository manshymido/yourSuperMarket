import { PrismaService } from '../common/prisma.service';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    private transporter;
    constructor(prisma: PrismaService);
    createNotification(userId: string, title: string, message: string, type: string): Promise<{
        message: string;
        id: string;
        title: string;
        type: string;
        isRead: boolean;
        createdAt: Date;
        userId: string;
    }>;
    getUserNotifications(userId: string): Promise<{
        message: string;
        id: string;
        title: string;
        type: string;
        isRead: boolean;
        createdAt: Date;
        userId: string;
    }[]>;
    markAsRead(userId: string, notificationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    sendEmail(to: string, subject: string, html: string): Promise<void>;
}
