import { HolidayDto, WeeklyOffPolicyDto } from '../dtos/holiday.dto';
import { Holiday, WeeklyOffPolicy } from '../../domain/models/holiday.model';

export class HolidayMapper {
  static fromHolidayDto(dto: HolidayDto): Holiday {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      branchId: dto.branchId,
      branchName: dto.branchName,
      name: dto.name,
      date: dto.date,
      type: dto.type,
      description: dto.description,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromWeeklyOffDto(dto: WeeklyOffPolicyDto): WeeklyOffPolicy {
    return {
      companyId: dto.companyId,
      mondayOff: dto.mondayOff,
      tuesdayOff: dto.tuesdayOff,
      wednesdayOff: dto.wednesdayOff,
      thursdayOff: dto.thursdayOff,
      fridayOff: dto.fridayOff,
      saturdayOff: dto.saturdayOff,
      sundayOff: dto.sundayOff,
      alternateSaturdayOff: dto.alternateSaturdayOff
    };
  }
}
