export interface NotificationItem {
  id: number;
  uuid: string;
  userId: number;
  title: string;
  message: string;
  type: string;
  actionUrl?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface UnreadNotificationCount {
  unreadCount: number;
}
