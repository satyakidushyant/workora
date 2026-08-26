import { Observable } from 'rxjs';
import { Holiday, WeeklyOffPolicy, SaveHolidayParams } from '../models/holiday.model';

/**
 * Repository interface for Holidays and Weekly-off policies.
 */
export interface IHolidayRepository {
  getHolidays(year: number, branchId?: number, companyId?: number): Observable<Holiday[]>;
  getHolidayById(id: number): Observable<Holiday>;
  createHoliday(params: SaveHolidayParams): Observable<Holiday>;
  updateHoliday(params: SaveHolidayParams): Observable<Holiday>;
  deleteHoliday(id: number): Observable<boolean>;
  getWeeklyOffPolicy(companyId: number): Observable<WeeklyOffPolicy>;
  updateWeeklyOffPolicy(policy: WeeklyOffPolicy): Observable<WeeklyOffPolicy>;
}
