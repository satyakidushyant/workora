import { Observable } from 'rxjs';
import { FieldVisit, LiveLocation, TravelDistanceSummary, CheckInVisitParams, CheckOutVisitParams } from '../models/field-tracking.model';

export interface IFieldTrackingRepository {
  getLiveLocations(): Observable<LiveLocation[]>;
  getVisitHistory(employeeId: number, fromDate?: string, toDate?: string): Observable<FieldVisit[]>;
  getTravelDistanceReport(employeeId: number, fromDate: string, toDate: string): Observable<TravelDistanceSummary>;
  checkInVisit(params: CheckInVisitParams): Observable<FieldVisit>;
  checkOutVisit(params: CheckOutVisitParams): Observable<FieldVisit>;
}
