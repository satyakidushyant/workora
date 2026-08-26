import { NotificationDto, UnreadNotificationCountDto } from '../dtos/notification.dto';
import { NotificationItem, UnreadNotificationCount } from '../../domain/models/notification.model';

export class NotificationMapper {
  static fromNotificationDto(dto: NotificationDto): NotificationItem {
    return {
      id: dto.id,
      uuid: dto.uuid,
      userId: dto.userId,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      actionUrl: dto.actionUrl,
      isRead: dto.isRead,
      readAt: dto.readAt,
      createdAt: dto.createdAt
    };
  }

  static fromCountDto(dto: UnreadNotificationCountDto): UnreadNotificationCount {
    return {
      unreadCount: dto.unreadCount
    };
  }
}
