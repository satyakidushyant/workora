import { TaskItemDto } from '../dtos/task.dto';
import { TaskItem } from '../../domain/models/task.model';

export class TaskMapper {
  static fromTaskDto(dto: TaskItemDto): TaskItem {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      title: dto.title,
      description: dto.description,
      assignedToEmployeeId: dto.assignedToEmployeeId,
      assignedToEmployeeName: dto.assignedToEmployeeName,
      createdByEmployeeId: dto.createdByEmployeeId,
      createdByEmployeeName: dto.createdByEmployeeName,
      priority: dto.priority,
      dueDate: dto.dueDate,
      status: dto.status,
      completedAt: dto.completedAt,
      createdAt: dto.createdAt
    };
  }
}
