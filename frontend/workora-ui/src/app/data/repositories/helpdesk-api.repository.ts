import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHelpdeskRepository } from '../../domain/repositories/i-helpdesk.repository';
import { HelpdeskTicket, TicketComment, CreateTicketParams, ResolveTicketParams, AddCommentParams } from '../../domain/models/helpdesk.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import {
  HelpdeskTicketDto,
  TicketCommentDto,
  CreateTicketRequestDto,
  ResolveTicketRequestDto,
  AddCommentRequestDto
} from '../dtos/helpdesk.dto';
import { HelpdeskMapper } from '../mappers/helpdesk.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelpdeskApiRepository implements IHelpdeskRepository {
  private readonly baseUrl = `${environment.apiUrl}/helpdesk`;

  constructor(private readonly http: HttpClient) {}

  getTickets(companyId?: number, status?: string, category?: string, priority?: string): Observable<HelpdeskTicket[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);
    if (priority) params = params.set('priority', priority);

    return this.http.get<ApiResponse<HelpdeskTicketDto[]>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch tickets.');
        }
        return response.data.map(t => HelpdeskMapper.fromTicketDto(t));
      })
    );
  }

  getMyTickets(): Observable<HelpdeskTicket[]> {
    return this.http.get<ApiResponse<HelpdeskTicketDto[]>>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch my tickets.');
        }
        return response.data.map(t => HelpdeskMapper.fromTicketDto(t));
      })
    );
  }

  getTicketById(id: number): Observable<HelpdeskTicket> {
    return this.http.get<ApiResponse<HelpdeskTicketDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch ticket #${id}.`);
        }
        return HelpdeskMapper.fromTicketDto(response.data);
      })
    );
  }

  createTicket(params: CreateTicketParams): Observable<HelpdeskTicket> {
    const payload: CreateTicketRequestDto = {
      category: params.category,
      subject: params.subject,
      description: params.description,
      priority: params.priority
    };

    return this.http.post<ApiResponse<HelpdeskTicketDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create ticket.');
        }
        return HelpdeskMapper.fromTicketDto(response.data);
      })
    );
  }

  assignTicket(id: number, assignedToEmployeeId: number): Observable<HelpdeskTicket> {
    return this.http.patch<ApiResponse<HelpdeskTicketDto>>(`${this.baseUrl}/${id}/assign`, assignedToEmployeeId).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to assign ticket.');
        }
        return HelpdeskMapper.fromTicketDto(response.data);
      })
    );
  }

  resolveTicket(params: ResolveTicketParams): Observable<HelpdeskTicket> {
    const payload: ResolveTicketRequestDto = { resolutionNotes: params.resolutionNotes };
    return this.http.patch<ApiResponse<HelpdeskTicketDto>>(`${this.baseUrl}/${params.ticketId}/resolve`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to resolve ticket.');
        }
        return HelpdeskMapper.fromTicketDto(response.data);
      })
    );
  }

  closeTicket(id: number): Observable<HelpdeskTicket> {
    return this.http.patch<ApiResponse<HelpdeskTicketDto>>(`${this.baseUrl}/${id}/close`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to close ticket.');
        }
        return HelpdeskMapper.fromTicketDto(response.data);
      })
    );
  }

  addComment(params: AddCommentParams): Observable<TicketComment> {
    const payload: AddCommentRequestDto = {
      userId: params.userId,
      commentText: params.commentText,
      attachmentUrl: params.attachmentUrl || null,
      isInternalOnly: params.isInternalOnly || false
    };

    return this.http.post<ApiResponse<TicketCommentDto>>(`${this.baseUrl}/${params.ticketId}/comments`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to post ticket comment.');
        }
        return HelpdeskMapper.fromCommentDto(response.data);
      })
    );
  }
}
