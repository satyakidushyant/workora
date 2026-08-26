import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import { NotificationItem, UnreadNotificationCount } from '../models/notification.model';

export interface INotificationRepository {
  getNotifications(pageNumber?: number, pageSize?: number, isRead?: boolean): Observable<PagedResponse<NotificationItem>>;
  getUnreadCount(): Observable<UnreadNotificationCount>;
  markRead(id: number): Observable<boolean>;
  markAllRead(): Observable<boolean>;
}
