import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  SalaryStructure,
  EmployeeSalaryAssignment,
  PayrollRun,
  PayrollRunDetail,
  Payslip,
  Payhead,
  SaveSalaryStructureParams,
  AssignSalaryStructureParams,
  CreatePayrollRunParams
} from '../models/payroll.model';

/**
 * Repository interface for Payroll calculations, Salary structures, and Payslips.
 */
export interface IPayrollRepository {
  getStructures(companyId: number): Observable<SalaryStructure[]>;
  getStructureById(id: number): Observable<SalaryStructure>;
  createStructure(params: SaveSalaryStructureParams): Observable<SalaryStructure>;
  updateStructure(params: SaveSalaryStructureParams): Observable<SalaryStructure>;
  assignStructure(params: AssignSalaryStructureParams): Observable<boolean>;
  getEmployeeStructure(employeeId: number): Observable<EmployeeSalaryAssignment>;
  getSalaryStructureHistory(employeeId: number): Observable<EmployeeSalaryAssignment[]>;
  getRuns(pageNumber?: number, pageSize?: number): Observable<PagedResponse<PayrollRun>>;
  getRunById(id: number): Observable<PayrollRunDetail>;
  createRun(params: CreatePayrollRunParams): Observable<PayrollRunDetail>;
  processRun(id: number): Observable<PayrollRun>;
  approveRun(id: number): Observable<PayrollRun>;
  disburseRun(id: number): Observable<PayrollRun>;
  getPayslipById(id: number): Observable<Payslip>;
  getMyPayslips(year?: number): Observable<Payslip[]>;
  getPayheads(companyId?: number): Observable<Payhead[]>;
}
