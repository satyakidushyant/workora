import { Observable } from 'rxjs';
import { SystemSetting, UpdateCompanySettingsParams } from '../models/system-settings.model';

/**
 * Repository interface for System Settings operations.
 */
export interface ISystemSettingsRepository {
  getSettings(companyId: number, group?: string): Observable<SystemSetting[]>;
  updateSettings(params: UpdateCompanySettingsParams): Observable<SystemSetting[]>;
}
