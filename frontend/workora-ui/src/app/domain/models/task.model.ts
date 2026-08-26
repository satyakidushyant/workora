export interface TaskItem {
  id: number;
  uuid: string;
  companyId: number;
  title: string;
  description?: string | null;
  assignedToEmployeeId: number;
  assignedToEmployeeName?: string | null;
  createdByEmployeeId: number;
  createdByEmployeeName?: string | null;
  priority: string; // 'Low' | 'Medium' | 'High' | 'Critical'
  dueDate: string;
  status: string; // 'ToDo' | 'InProgress' | 'InReview' | 'Done' | 'Cancelled'
  completedAt?: string | null;
  createdAt: string;
}

export interface CreateTaskParams {
  title: string;
  description?: string | null;
  assignedToEmployeeId: number;
  priority: string;
  dueDate: string;
}
