import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INotificationRepository } from '../../domain/repositories/i-notification.repository';
import { NotificationItem, UnreadNotificationCount } from '../../domain/models/notification.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import { NotificationDto, UnreadNotificationCountDto } from '../dtos/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiRepository implements INotificationRepository {
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private readonly http: HttpClient) {}

  getNotifications(pageNumber = 1, pageSize = 20, isRead?: boolean): Observable<PagedResponse<NotificationItem>> {
    let params = new HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    if (isRead !== undefined) params = params.set('isRead', isRead.toString());

    return this.http.get<ApiResponse<PagedResponse<NotificationDto>>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch notifications.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(n => NotificationMapper.fromNotificationDto(n)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || pageNumber,
          pageSize: paged.pageSize || pageSize,
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getUnreadCount(): Observable<UnreadNotificationCount> {
    return this.http.get<ApiResponse<UnreadNotificationCountDto>>(`${this.baseUrl}/unread-count`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch unread count.');
        }
        return NotificationMapper.fromCountDto(response.data);
      })
    );
  }

  markRead(id: number): Observable<boolean> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/${id}/read`, {}).pipe(
      map(response => response.isSuccess && !!response.data)
    );
  }

  markAllRead(): Observable<boolean> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/read-all`, {}).pipe(
      map(response => response.isSuccess && !!response.data)
    );
  }
}
