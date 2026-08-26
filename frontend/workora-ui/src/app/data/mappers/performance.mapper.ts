import {
  AppraisalDto,
  GoalDto,
  PerformanceCycleDto
} from '../dtos/performance.dto';
import {
  Appraisal,
  Goal,
  PerformanceCycle
} from '../../domain/models/performance.model';

export class PerformanceMapper {
  static fromAppraisalDto(dto: AppraisalDto): Appraisal {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      reviewerEmployeeId: dto.reviewerEmployeeId,
      reviewerName: dto.reviewerName,
      period: dto.period,
      year: dto.year,
      status: dto.status,
      selfReviewComments: dto.selfReviewComments,
      selfReviewRating: dto.selfReviewRating,
      managerReviewComments: dto.managerReviewComments,
      managerReviewRating: dto.managerReviewRating,
      finalScore: dto.finalScore,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromGoalDto(dto: GoalDto): Goal {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      title: dto.title,
      description: dto.description,
      targetDate: dto.targetDate,
      progressPercentage: dto.progressPercentage,
      status: dto.status,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromCycleDto(dto: PerformanceCycleDto): PerformanceCycle {
    return {
      id: dto.id,
      companyId: dto.companyId,
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status
    };
  }
}
