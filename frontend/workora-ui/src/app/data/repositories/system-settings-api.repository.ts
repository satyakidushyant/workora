import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISystemSettingsRepository } from '../../domain/repositories/i-system-settings.repository';
import { SystemSetting, UpdateCompanySettingsParams } from '../../domain/models/system-settings.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { SystemSettingDto, UpdateCompanySettingsRequestDto } from '../dtos/system-settings.dto';
import { SystemSettingsMapper } from '../mappers/system-settings.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsApiRepository implements ISystemSettingsRepository {
  private readonly baseUrl = `${environment.apiUrl}/settings`;

  constructor(private readonly http: HttpClient) {}

  getSettings(companyId: number, group?: string): Observable<SystemSetting[]> {
    let httpParams = new HttpParams().set('companyId', companyId.toString());
    if (group) {
      httpParams = httpParams.set('group', group);
    }

    return this.http.get<ApiResponse<SystemSettingDto[]>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch system settings.');
        }
        return response.data.map(s => SystemSettingsMapper.fromSettingDto(s));
      })
    );
  }

  updateSettings(params: UpdateCompanySettingsParams): Observable<SystemSetting[]> {
    const payload: UpdateCompanySettingsRequestDto = {
      companyId: params.companyId,
      settings: params.settings.map(s => ({
        key: s.key,
        value: s.value,
        description: s.description || null,
        group: s.group
      }))
    };

    return this.http.put<ApiResponse<SystemSettingDto[]>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update system settings.');
        }
        return response.data.map(s => SystemSettingsMapper.fromSettingDto(s));
      })
    );
  }
}
