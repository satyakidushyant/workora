export interface HelpdeskTicketDto {
  id: number;
  uuid: string;
  companyId: number;
  ticketNumber: string;
  raisedByEmployeeId: number;
  raisedByEmployeeName?: string | null;
  assignedToEmployeeId?: number | null;
  assignedToEmployeeName?: string | null;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  comments?: TicketCommentDto[];
  createdAt: string;
}

export interface TicketCommentDto {
  id: number;
  uuid: string;
  ticketId: number;
  userId: number;
  authorName?: string | null;
  commentText: string;
  attachmentUrl?: string | null;
  isInternalOnly: boolean;
  createdAt: string;
}

export interface CreateTicketRequestDto {
  category: string;
  subject: string;
  description: string;
  priority: string;
}

export interface ResolveTicketRequestDto {
  resolutionNotes: string;
}

export interface AddCommentRequestDto {
  userId: number;
  commentText: string;
  attachmentUrl?: string | null;
  isInternalOnly?: boolean;
}
