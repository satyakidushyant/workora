import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IShiftRepository } from '../../domain/repositories/i-shift.repository';
import { Shift, SaveShiftParams, AssignShiftParams } from '../../domain/models/shift.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import { ShiftDto, CreateShiftRequestDto, UpdateShiftRequestDto, AssignShiftRequestDto } from '../dtos/shift.dto';
import { ShiftMapper } from '../mappers/shift.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShiftApiRepository implements IShiftRepository {
  private readonly baseUrl = `${environment.apiUrl}/shifts`;

  constructor(private readonly http: HttpClient) {}

  getShifts(pageNumber = 1, pageSize = 10, searchTerm?: string): Observable<PagedResponse<Shift>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http.get<ApiResponse<PagedResponse<ShiftDto>>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch shifts.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(s => ShiftMapper.fromShiftDto(s)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || pageNumber,
          pageSize: paged.pageSize || pageSize,
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getShiftById(id: number): Observable<Shift> {
    return this.http.get<ApiResponse<ShiftDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch shift #${id}.`);
        }
        return ShiftMapper.fromShiftDto(response.data);
      })
    );
  }

  createShift(params: SaveShiftParams): Observable<Shift> {
    const payload: CreateShiftRequestDto = {
      companyId: params.companyId,
      name: params.name,
      code: params.code,
      startTime: params.startTime,
      endTime: params.endTime,
      spansMidnight: params.spansMidnight,
      gracePeriodMinutes: params.gracePeriodMinutes,
      breakMinutes: params.breakMinutes,
      branchId: params.branchId || null,
      description: params.description || null
    };

    return this.http.post<ApiResponse<ShiftDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create shift.');
        }
        return ShiftMapper.fromShiftDto(response.data);
      })
    );
  }

  updateShift(params: SaveShiftParams): Observable<Shift> {
    const payload: UpdateShiftRequestDto = {
      name: params.name,
      code: params.code,
      startTime: params.startTime,
      endTime: params.endTime,
      spansMidnight: params.spansMidnight,
      gracePeriodMinutes: params.gracePeriodMinutes,
      breakMinutes: params.breakMinutes,
      branchId: params.branchId || null,
      description: params.description || null
    };

    return this.http.put<ApiResponse<ShiftDto>>(`${this.baseUrl}/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update shift.');
        }
        return ShiftMapper.fromShiftDto(response.data);
      })
    );
  }

  deleteShift(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete shift.');
        }
        return response.data ?? true;
      })
    );
  }

  assignShift(params: AssignShiftParams): Observable<boolean> {
    const payload: AssignShiftRequestDto = {
      employeeId: params.employeeId,
      shiftId: params.shiftId,
      effectiveFrom: params.effectiveFrom,
      effectiveTo: params.effectiveTo || null
    };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/assign`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to assign shift.');
        }
        return response.data ?? true;
      })
    );
  }
}
