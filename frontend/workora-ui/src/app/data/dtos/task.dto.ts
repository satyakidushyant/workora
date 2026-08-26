export interface TaskItemDto {
  id: number;
  uuid: string;
  companyId: number;
  title: string;
  description?: string | null;
  assignedToEmployeeId: number;
  assignedToEmployeeName?: string | null;
  createdByEmployeeId: number;
  createdByEmployeeName?: string | null;
  priority: string;
  dueDate: string;
  status: string;
  completedAt?: string | null;
  createdAt: string;
}

export interface CreateTaskRequestDto {
  title: string;
  description?: string | null;
  assignedToEmployeeId: number;
  priority: string;
  dueDate: string;
}
