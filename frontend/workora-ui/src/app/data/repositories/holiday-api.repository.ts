import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHolidayRepository } from '../../domain/repositories/i-holiday.repository';
import { Holiday, WeeklyOffPolicy, SaveHolidayParams } from '../../domain/models/holiday.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import {
  HolidayDto,
  WeeklyOffPolicyDto,
  CreateHolidayRequestDto,
  UpdateHolidayRequestDto
} from '../dtos/holiday.dto';
import { HolidayMapper } from '../mappers/holiday.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayApiRepository implements IHolidayRepository {
  private readonly baseUrl = `${environment.apiUrl}/holidays`;

  constructor(private readonly http: HttpClient) {}

  getHolidays(year: number, branchId?: number, companyId?: number): Observable<Holiday[]>{
    let params = new HttpParams().set('year', year.toString());
    if (branchId) params = params.set('branchId', branchId.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<HolidayDto[]>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch holiday calendar.');
        }
        return response.data.map(h => HolidayMapper.fromHolidayDto(h));
      })
    );
  }

  getHolidayById(id: number): Observable<Holiday> {
    return this.http.get<ApiResponse<HolidayDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch holiday #${id}.`);
        }
        return HolidayMapper.fromHolidayDto(response.data);
      })
    );
  }

  createHoliday(params: SaveHolidayParams): Observable<Holiday> {
    const payload: CreateHolidayRequestDto = {
      companyId: params.companyId,
      name: params.name,
      date: params.date,
      type: params.type,
      branchId: params.branchId || null,
      description: params.description || null
    };

    return this.http.post<ApiResponse<HolidayDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create holiday.');
        }
        return HolidayMapper.fromHolidayDto(response.data);
      })
    );
  }

  updateHoliday(params: SaveHolidayParams): Observable<Holiday> {
    const payload: UpdateHolidayRequestDto = {
      name: params.name,
      date: params.date,
      type: params.type,
      branchId: params.branchId || null,
      description: params.description || null
    };

    return this.http.put<ApiResponse<HolidayDto>>(`${this.baseUrl}/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update holiday.');
        }
        return HolidayMapper.fromHolidayDto(response.data);
      })
    );
  }

  deleteHoliday(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete holiday.');
        }
        return response.data ?? true;
      })
    );
  }

  getWeeklyOffPolicy(companyId: number): Observable<WeeklyOffPolicy> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<ApiResponse<WeeklyOffPolicyDto>>(`${environment.apiUrl}/weekly-offs`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch weekly off policy.');
        }
        return HolidayMapper.fromWeeklyOffDto(response.data);
      })
    );
  }

  updateWeeklyOffPolicy(policy: WeeklyOffPolicy): Observable<WeeklyOffPolicy> {
    return this.http.put<ApiResponse<WeeklyOffPolicyDto>>(`${environment.apiUrl}/weekly-offs`, policy).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update weekly off policy.');
        }
        return HolidayMapper.fromWeeklyOffDto(response.data);
      })
    );
  }
}
