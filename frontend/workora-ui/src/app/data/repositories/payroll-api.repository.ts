import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPayrollRepository } from '../../domain/repositories/i-payroll.repository';
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
} from '../../domain/models/payroll.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  SalaryStructureDto,
  EmployeeSalaryAssignmentDto,
  PayrollRunDto,
  PayrollRunDetailDto,
  PayslipDto,
  PayheadDto,
  CreateSalaryStructureRequestDto,
  UpdateSalaryStructureRequestDto,
  AssignSalaryStructureRequestDto,
  CreatePayrollRunRequestDto
} from '../dtos/payroll.dto';
import { PayrollMapper } from '../mappers/payroll.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayrollApiRepository implements IPayrollRepository {
  private readonly baseUrl = `${environment.apiUrl}/payroll`;

  constructor(private readonly http: HttpClient) {}

  getStructures(companyId = 1): Observable<SalaryStructure[]> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<ApiResponse<SalaryStructureDto[]>>(`${this.baseUrl}/structures`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch salary structures.');
        }
        return response.data.map(s => PayrollMapper.fromSalaryStructureDto(s));
      })
    );
  }

  getStructureById(id: number): Observable<SalaryStructure> {
    return this.http.get<ApiResponse<SalaryStructureDto>>(`${this.baseUrl}/structures/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch salary structure #${id}.`);
        }
        return PayrollMapper.fromSalaryStructureDto(response.data);
      })
    );
  }

  createStructure(params: SaveSalaryStructureParams): Observable<SalaryStructure> {
    const payload: CreateSalaryStructureRequestDto = {
      companyId: params.companyId,
      name: params.name,
      description: params.description || null,
      components: params.components.map(c => ({
        name: c.name,
        code: c.code,
        type: c.type,
        calculationType: c.calculationType,
        defaultValue: c.defaultValue,
        isTaxable: c.isTaxable
      }))
    };

    return this.http.post<ApiResponse<SalaryStructureDto>>(`${this.baseUrl}/structures`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create salary structure.');
        }
        return PayrollMapper.fromSalaryStructureDto(response.data);
      })
    );
  }

  updateStructure(params: SaveSalaryStructureParams): Observable<SalaryStructure> {
    const payload: UpdateSalaryStructureRequestDto = {
      name: params.name,
      description: params.description || null,
      components: params.components.map(c => ({
        name: c.name,
        code: c.code,
        type: c.type,
        calculationType: c.calculationType,
        defaultValue: c.defaultValue,
        isTaxable: c.isTaxable
      }))
    };

    return this.http.put<ApiResponse<SalaryStructureDto>>(`${this.baseUrl}/structures/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update salary structure.');
        }
        return PayrollMapper.fromSalaryStructureDto(response.data);
      })
    );
  }

  assignStructure(params: AssignSalaryStructureParams): Observable<boolean> {
    const payload: AssignSalaryStructureRequestDto = {
      employeeId: params.employeeId,
      salaryStructureId: params.salaryStructureId,
      baseSalary: params.baseSalary,
      effectiveFrom: params.effectiveFrom,
      effectiveTo: params.effectiveTo || null
    };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/assign-structure`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to assign salary structure.');
        }
        return response.data ?? true;
      })
    );
  }

  getEmployeeStructure(employeeId: number): Observable<EmployeeSalaryAssignment> {
    return this.http.get<ApiResponse<EmployeeSalaryAssignmentDto>>(`${this.baseUrl}/employee-structure/${employeeId}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch employee salary structure.');
        }
        return PayrollMapper.fromAssignmentDto(response.data);
      })
    );
  }

  getSalaryStructureHistory(employeeId: number): Observable<EmployeeSalaryAssignment[]> {
    return this.http.get<ApiResponse<EmployeeSalaryAssignmentDto[]>>(`${this.baseUrl}/structures/history/${employeeId}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch salary history.');
        }
        return response.data.map(a => PayrollMapper.fromAssignmentDto(a));
      })
    );
  }

  getRuns(pageNumber = 1, pageSize = 10): Observable<PagedResponse<PayrollRun>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResponse<PayrollRunDto>>>(`${this.baseUrl}/runs`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch payroll runs.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(r => PayrollMapper.fromRunDto(r)),
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

  getRunById(id: number): Observable<PayrollRunDetail> {
    return this.http.get<ApiResponse<PayrollRunDetailDto>>(`${this.baseUrl}/runs/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch payroll run #${id}.`);
        }
        return PayrollMapper.fromRunDetailDto(response.data);
      })
    );
  }

  createRun(params: CreatePayrollRunParams): Observable<PayrollRunDetail> {
    const payload: CreatePayrollRunRequestDto = {
      companyId: params.companyId,
      periodMonth: params.periodMonth,
      periodYear: params.periodYear
    };

    return this.http.post<ApiResponse<PayrollRunDetailDto>>(`${this.baseUrl}/runs`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to compute payroll cycle.');
        }
        return PayrollMapper.fromRunDetailDto(response.data);
      })
    );
  }

  processRun(id: number): Observable<PayrollRun> {
    return this.http.post<ApiResponse<PayrollRunDto>>(`${this.baseUrl}/runs/${id}/process`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to process calculations.');
        }
        return PayrollMapper.fromRunDto(response.data);
      })
    );
  }

  approveRun(id: number): Observable<PayrollRun> {
    return this.http.post<ApiResponse<PayrollRunDto>>(`${this.baseUrl}/runs/${id}/approve`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to approve payroll run.');
        }
        return PayrollMapper.fromRunDto(response.data);
      })
    );
  }

  disburseRun(id: number): Observable<PayrollRun> {
    return this.http.post<ApiResponse<PayrollRunDto>>(`${this.baseUrl}/runs/${id}/disburse`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to disburse payroll run.');
        }
        return PayrollMapper.fromRunDto(response.data);
      })
    );
  }

  getPayslipById(id: number): Observable<Payslip> {
    return this.http.get<ApiResponse<PayslipDto>>(`${this.baseUrl}/payslips/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch payslip #${id}.`);
        }
        return PayrollMapper.fromPayslipDto(response.data);
      })
    );
  }

  getMyPayslips(year?: number): Observable<Payslip[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());

    return this.http.get<ApiResponse<PayslipDto[]>>(`${this.baseUrl}/my-payslips`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch personal payslips.');
        }
        return response.data.map(p => PayrollMapper.fromPayslipDto(p));
      })
    );
  }

  getPayheads(companyId?: number): Observable<Payhead[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<PayheadDto[]>>(`${environment.apiUrl}/payheads`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch salary payheads.');
        }
        return response.data.map(p => PayrollMapper.fromPayheadDto(p));
      })
    );
  }
}
