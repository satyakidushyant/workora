import { ShiftDto } from '../dtos/shift.dto';
import { Shift } from '../../domain/models/shift.model';

export class ShiftMapper {
  static fromShiftDto(dto: ShiftDto): Shift {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      branchId: dto.branchId,
      name: dto.name,
      code: dto.code,
      startTime: dto.startTime,
      endTime: dto.endTime,
      spansMidnight: dto.spansMidnight,
      gracePeriodMinutes: dto.gracePeriodMinutes,
      breakMinutes: dto.breakMinutes,
      description: dto.description,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }
}
