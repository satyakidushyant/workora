import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import { Shift, SaveShiftParams, AssignShiftParams } from '../models/shift.model';

/**
 * Repository interface for Shifts management and scheduling.
 */
export interface IShiftRepository {
  getShifts(pageNumber?: number, pageSize?: number, searchTerm?: string): Observable<PagedResponse<Shift>>;
  getShiftById(id: number): Observable<Shift>;
  createShift(params: SaveShiftParams): Observable<Shift>;
  updateShift(params: SaveShiftParams): Observable<Shift>;
  deleteShift(id: number): Observable<boolean>;
  assignShift(params: AssignShiftParams): Observable<boolean>;
}
