import { Observable } from 'rxjs';
import { HelpdeskTicket, TicketComment, CreateTicketParams, ResolveTicketParams, AddCommentParams } from '../models/helpdesk.model';

export interface IHelpdeskRepository {
  getTickets(companyId?: number, status?: string, category?: string, priority?: string): Observable<HelpdeskTicket[]>;
  getMyTickets(): Observable<HelpdeskTicket[]>;
  getTicketById(id: number): Observable<HelpdeskTicket>;
  createTicket(params: CreateTicketParams): Observable<HelpdeskTicket>;
  assignTicket(id: number, assignedToEmployeeId: number): Observable<HelpdeskTicket>;
  resolveTicket(params: ResolveTicketParams): Observable<HelpdeskTicket>;
  closeTicket(id: number): Observable<HelpdeskTicket>;
  addComment(params: AddCommentParams): Observable<TicketComment>;
}
