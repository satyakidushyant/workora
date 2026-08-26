export interface HelpdeskTicket {
  id: number;
  uuid: string;
  companyId: number;
  ticketNumber: string;
  raisedByEmployeeId: number;
  raisedByEmployeeName?: string | null;
  assignedToEmployeeId?: number | null;
  assignedToEmployeeName?: string | null;
  category: string; // 'General' | 'Payroll' | 'Attendance' | 'ITSupport' | 'HRPolicy' | 'Facilities'
  subject: string;
  description: string;
  priority: string; // 'Low' | 'Medium' | 'High' | 'Urgent'
  status: string; // 'Open' | 'InProgress' | 'Resolved' | 'Closed'
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  comments?: TicketComment[];
  createdAt: string;
}

export interface TicketComment {
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

export interface CreateTicketParams {
  category: string;
  subject: string;
  description: string;
  priority: string;
}

export interface ResolveTicketParams {
  ticketId: number;
  resolutionNotes: string;
}

export interface AddCommentParams {
  ticketId: number;
  userId: number;
  commentText: string;
  attachmentUrl?: string | null;
  isInternalOnly?: boolean;
}
