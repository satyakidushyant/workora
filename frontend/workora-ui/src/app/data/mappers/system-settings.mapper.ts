import { SystemSettingDto } from '../dtos/system-settings.dto';
import { SystemSetting } from '../../domain/models/system-settings.model';

export class SystemSettingsMapper {
  static fromSettingDto(dto: SystemSettingDto): SystemSetting {
    return {
      id: dto.id,
      companyId: dto.companyId,
      key: dto.key,
      value: dto.value,
      description: dto.description,
      group: dto.group,
      isActive: dto.isActive
    };
  }
}
