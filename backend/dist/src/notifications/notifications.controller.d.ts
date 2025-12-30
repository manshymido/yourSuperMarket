import { NotificationsService } from './notifications.service';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(user: CurrentUserPayload): Promise<{
        message: string;
        id: string;
        title: string;
        type: string;
        isRead: boolean;
        createdAt: Date;
        userId: string;
    }[]>;
    markAsRead(user: CurrentUserPayload, notificationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
