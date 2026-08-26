import { HelpdeskTicketDto, TicketCommentDto } from '../dtos/helpdesk.dto';
import { HelpdeskTicket, TicketComment } from '../../domain/models/helpdesk.model';

export class HelpdeskMapper {
  static fromTicketDto(dto: HelpdeskTicketDto): HelpdeskTicket {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      ticketNumber: dto.ticketNumber,
      raisedByEmployeeId: dto.raisedByEmployeeId,
      raisedByEmployeeName: dto.raisedByEmployeeName,
      assignedToEmployeeId: dto.assignedToEmployeeId,
      assignedToEmployeeName: dto.assignedToEmployeeName,
      category: dto.category,
      subject: dto.subject,
      description: dto.description,
      priority: dto.priority,
      status: dto.status,
      resolvedAt: dto.resolvedAt,
      resolutionNotes: dto.resolutionNotes,
      comments: (dto.comments || []).map(c => this.fromCommentDto(c)),
      createdAt: dto.createdAt
    };
  }

  static fromCommentDto(dto: TicketCommentDto): TicketComment {
    return {
      id: dto.id,
      uuid: dto.uuid,
      ticketId: dto.ticketId,
      userId: dto.userId,
      authorName: dto.authorName,
      commentText: dto.commentText,
      attachmentUrl: dto.attachmentUrl,
      isInternalOnly: dto.isInternalOnly,
      createdAt: dto.createdAt
    };
  }
}
