import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFieldTrackingRepository } from '../../domain/repositories/i-field-tracking.repository';
import { FieldVisit, LiveLocation, TravelDistanceSummary, CheckInVisitParams, CheckOutVisitParams } from '../../domain/models/field-tracking.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { FieldVisitDto, LiveLocationDto, TravelDistanceSummaryDto, CheckInVisitRequestDto, CheckOutVisitRequestDto } from '../dtos/field-tracking.dto';
import { FieldTrackingMapper } from '../mappers/field-tracking.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldTrackingApiRepository implements IFieldTrackingRepository {
  private readonly baseUrl = `${environment.apiUrl}/field`;

  constructor(private readonly http: HttpClient) {}

  getLiveLocations(): Observable<LiveLocation[]> {
    return this.http.get<ApiResponse<LiveLocationDto[]>>(`${this.baseUrl}/locations`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch field agent locations.');
        }
        return response.data.map(l => FieldTrackingMapper.fromLocationDto(l));
      })
    );
  }

  getVisitHistory(employeeId: number, fromDate?: string, toDate?: string): Observable<FieldVisit[]> {
    let params = new HttpParams();
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http.get<ApiResponse<FieldVisitDto[]>>(`${this.baseUrl}/visits/history/${employeeId}`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch visit history.');
        }
        return response.data.map(v => FieldTrackingMapper.fromVisitDto(v));
      })
    );
  }

  getTravelDistanceReport(employeeId: number, fromDate: string, toDate: string): Observable<TravelDistanceSummary> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);

    return this.http.get<ApiResponse<TravelDistanceSummaryDto>>(`${this.baseUrl}/reports/travel-km/${employeeId}`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch travel distance metrics.');
        }
        return FieldTrackingMapper.fromDistanceDto(response.data);
      })
    );
  }

  checkInVisit(params: CheckInVisitParams): Observable<FieldVisit> {
    const payload: CheckInVisitRequestDto = {
      employeeId: params.employeeId,
      clientName: params.clientName,
      visitPurpose: params.visitPurpose,
      checkInLatitude: params.checkInLatitude,
      checkInLongitude: params.checkInLongitude,
      checkInAddress: params.checkInAddress
    };

    return this.http.post<ApiResponse<FieldVisitDto>>(`${this.baseUrl}/visits/check-in`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to check-in client visit.');
        }
        return FieldTrackingMapper.fromVisitDto(response.data);
      })
    );
  }

  checkOutVisit(params: CheckOutVisitParams): Observable<FieldVisit> {
    const payload: CheckOutVisitRequestDto = {
      visitId: params.visitId,
      checkOutLatitude: params.checkOutLatitude,
      checkOutLongitude: params.checkOutLongitude,
      meetingNotes: params.meetingNotes || null,
      signatureUrl: params.signatureUrl || null
    };

    return this.http.post<ApiResponse<FieldVisitDto>>(`${this.baseUrl}/visits/check-out`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to check-out client visit.');
        }
        return FieldTrackingMapper.fromVisitDto(response.data);
      })
    );
  }
}
