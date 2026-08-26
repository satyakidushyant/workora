import { TrainingProgramDto, TrainingEnrollmentDto } from '../dtos/training.dto';
import { TrainingProgram, TrainingEnrollment } from '../../domain/models/training.model';

export class TrainingMapper {
  static fromProgramDto(dto: TrainingProgramDto): TrainingProgram {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      title: dto.title,
      description: dto.description,
      trainerName: dto.trainerName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      capacity: dto.capacity,
      enrolledCount: dto.enrolledCount,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromEnrollmentDto(dto: TrainingEnrollmentDto): TrainingEnrollment {
    return {
      id: dto.id,
      trainingProgramId: dto.trainingProgramId,
      programTitle: dto.programTitle,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      status: dto.status,
      completedAt: dto.completedAt,
      createdAt: dto.createdAt
    };
  }
}
