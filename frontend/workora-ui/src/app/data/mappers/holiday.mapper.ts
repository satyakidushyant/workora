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
    const days = (dto.weeklyOffDays || 'Sunday').split(',').map(d => d.trim().toLowerCase());
    return {
      companyId: dto.companyId,
      mondayOff: dto.mondayOff ?? days.includes('monday'),
      tuesdayOff: dto.tuesdayOff ?? days.includes('tuesday'),
      wednesdayOff: dto.wednesdayOff ?? days.includes('wednesday'),
      thursdayOff: dto.thursdayOff ?? days.includes('thursday'),
      fridayOff: dto.fridayOff ?? days.includes('friday'),
      saturdayOff: dto.saturdayOff ?? days.includes('saturday'),
      sundayOff: dto.sundayOff ?? days.includes('sunday'),
      alternateSaturdayOff: !!dto.alternateSaturdayOff
    };
  }

  static toWeeklyOffRequestDto(policy: WeeklyOffPolicy): { companyId: number; weeklyOffDays: string; alternateSaturdayOff: boolean } {
    const days: string[] = [];
    if (policy.mondayOff) days.push('Monday');
    if (policy.tuesdayOff) days.push('Tuesday');
    if (policy.wednesdayOff) days.push('Wednesday');
    if (policy.thursdayOff) days.push('Thursday');
    if (policy.fridayOff) days.push('Friday');
    if (policy.saturdayOff) days.push('Saturday');
    if (policy.sundayOff) days.push('Sunday');

    return {
      companyId: policy.companyId || 1,
      weeklyOffDays: days.length > 0 ? days.join(',') : 'Sunday',
      alternateSaturdayOff: !!policy.alternateSaturdayOff
    };
  }
}
