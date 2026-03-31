import type { Notification } from "../shared/types";
/**
 * Get notifications for a user
 */
export declare const getNotificationsByUser: (userId: string, limit?: number) => Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
}>;
/**
 * Mark a single notification as read
 */
export declare const markNotificationAsRead: (userId: string, notificationId: string) => Promise<Notification | null>;
/**
 * Mark all notifications as read for a user
 */
export declare const markAllNotificationsAsRead: (userId: string) => Promise<boolean>;
/**
 * Create a notification for a user
 */
export declare const createNotification: (userId: string, type: string, title: string, message: string, requestId?: string, accessName?: string) => Promise<Notification>;
//# sourceMappingURL=dynamodb.d.ts.map