import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  Employee,
  EmployeeDetail,
  OrgChartNode,
  EmploymentHistory,
  EmployeeQueryParams,
  CreateEmployeeParams,
  UpdateEmployeeParams,
  TransferEmployeeParams,
  TerminateEmployeeParams,
  ReactivateEmployeeParams,
  UpsertEmergencyContactParams,
  UpsertBankDetailsParams
} from '../models/employee.model';

/**
 * Repository interface for Employee lifecycle management.
 */
export interface IEmployeeRepository {
  getEmployees(params?: EmployeeQueryParams): Observable<PagedResponse<Employee>>;
  getEmployeeById(id: number): Observable<EmployeeDetail>;
  getMyProfile(): Observable<EmployeeDetail>;
  createEmployee(params: CreateEmployeeParams): Observable<Employee>;
  updateEmployee(params: UpdateEmployeeParams): Observable<Employee>;
  transferEmployee(params: TransferEmployeeParams): Observable<Employee>;
  terminateEmployee(params: TerminateEmployeeParams): Observable<boolean>;
  reactivateEmployee(params: ReactivateEmployeeParams): Observable<Employee>;
  getEmployeeOrgChart(id: number): Observable<OrgChartNode>;
  getEmploymentHistory(id: number): Observable<EmploymentHistory[]>;
  getDirectReports(id: number): Observable<Employee[]>;
  upsertEmergencyContact(params: UpsertEmergencyContactParams): Observable<boolean>;
  upsertBankDetails(params: UpsertBankDetailsParams): Observable<boolean>;
  exportEmployees(): Observable<Employee[]>;
}
