import { NotificationsService } from './notifications.service';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
    }[]>;
    markAsRead(user: CurrentUserPayload, notificationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
