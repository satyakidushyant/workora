import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEmployeeRepository } from '../../domain/repositories/i-employee.repository';
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
} from '../../domain/models/employee.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  EmployeeDto,
  EmployeeDetailDto,
  OrgChartNodeDto,
  EmploymentHistoryDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  TransferEmployeeRequestDto,
  TerminateEmployeeRequestDto,
  ReactivateEmployeeRequestDto,
  UpsertEmergencyContactRequestDto,
  UpsertBankDetailsRequestDto
} from '../dtos/employee.dto';
import { EmployeeMapper } from '../mappers/employee.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiRepository implements IEmployeeRepository {
  private readonly baseUrl = `${environment.apiUrl}/employees`;

  constructor(private readonly http: HttpClient) {}

  getEmployees(params?: EmployeeQueryParams): Observable<PagedResponse<Employee>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.departmentId) httpParams = httpParams.set('departmentId', params.departmentId.toString());
      if (params.designationId) httpParams = httpParams.set('designationId', params.designationId.toString());
      if (params.branchId) httpParams = httpParams.set('branchId', params.branchId.toString());
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.companyId && !isNaN(Number(params.companyId)) && Number(params.companyId) > 0) {
        httpParams = httpParams.set('companyId', params.companyId.toString());
      }
    }

    return this.http.get<ApiResponse<PagedResponse<EmployeeDto>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch employees directory.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(e => EmployeeMapper.fromEmployeeDto(e)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || (params?.pageNumber || 1),
          pageSize: paged.pageSize || (params?.pageSize || 10),
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getEmployeeById(id: number): Observable<EmployeeDetail> {
    return this.http.get<ApiResponse<EmployeeDetailDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch employee #${id}.`);
        }
        return EmployeeMapper.fromEmployeeDetailDto(response.data);
      })
    );
  }

  getMyProfile(): Observable<EmployeeDetail> {
    return this.http.get<ApiResponse<EmployeeDetailDto>>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch employee profile.');
        }
        return EmployeeMapper.fromEmployeeDetailDto(response.data);
      })
    );
  }

  createEmployee(params: CreateEmployeeParams): Observable<Employee> {
    const payload: CreateEmployeeRequestDto = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone,
      nationalId: params.nationalId,
      dateOfBirth: params.dateOfBirth,
      gender: params.gender,
      maritalStatus: params.maritalStatus,
      hireDate: params.hireDate,
      departmentId: params.departmentId,
      designationId: params.designationId,
      branchId: params.branchId,
      managerId: params.managerId,
      employmentType: params.employmentType,
      address: params.address
    };

    return this.http.post<ApiResponse<EmployeeDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to onboard employee.');
        }
        return EmployeeMapper.fromEmployeeDto(response.data);
      })
    );
  }

  updateEmployee(params: UpdateEmployeeParams): Observable<Employee> {
    const payload: UpdateEmployeeRequestDto = {
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      dateOfBirth: params.dateOfBirth,
      gender: params.gender,
      maritalStatus: params.maritalStatus,
      managerId: params.managerId,
      address: params.address
    };

    return this.http.put<ApiResponse<EmployeeDto>>(`${this.baseUrl}/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update employee profile.');
        }
        return EmployeeMapper.fromEmployeeDto(response.data);
      })
    );
  }

  transferEmployee(params: TransferEmployeeParams): Observable<Employee> {
    const payload: TransferEmployeeRequestDto = {
      departmentId: params.departmentId,
      designationId: params.designationId,
      branchId: params.branchId,
      managerId: params.managerId,
      notes: params.notes
    };

    return this.http.patch<ApiResponse<EmployeeDto>>(`${this.baseUrl}/${params.id}/transfer`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to transfer employee.');
        }
        return EmployeeMapper.fromEmployeeDto(response.data);
      })
    );
  }

  terminateEmployee(params: TerminateEmployeeParams): Observable<boolean> {
    const payload: TerminateEmployeeRequestDto = {
      terminationDate: params.terminationDate,
      reason: params.reason
    };

    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/${params.id}/terminate`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to terminate employee.');
        }
        return response.data ?? true;
      })
    );
  }

  reactivateEmployee(params: ReactivateEmployeeParams): Observable<Employee> {
    const payload: ReactivateEmployeeRequestDto = {
      departmentId: params.departmentId,
      designationId: params.designationId,
      branchId: params.branchId,
      managerId: params.managerId,
      notes: params.notes
    };

    return this.http.patch<ApiResponse<EmployeeDto>>(`${this.baseUrl}/${params.id}/reactivate`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to reactivate employee.');
        }
        return EmployeeMapper.fromEmployeeDto(response.data);
      })
    );
  }

  getEmployeeOrgChart(id: number): Observable<OrgChartNode> {
    return this.http.get<ApiResponse<OrgChartNodeDto>>(`${this.baseUrl}/${id}/org-chart`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch org chart.');
        }
        return EmployeeMapper.fromOrgChartNodeDto(response.data);
      })
    );
  }

  getEmploymentHistory(id: number): Observable<EmploymentHistory[]> {
    return this.http.get<ApiResponse<EmploymentHistoryDto[]>>(`${this.baseUrl}/${id}/employment-history`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch employment history.');
        }
        return response.data.map(h => EmployeeMapper.fromEmploymentHistoryDto(h));
      })
    );
  }

  getDirectReports(id: number): Observable<Employee[]> {
    return this.http.get<ApiResponse<EmployeeDto[]>>(`${this.baseUrl}/${id}/direct-reports`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch direct reports.');
        }
        return response.data.map(e => EmployeeMapper.fromEmployeeDto(e));
      })
    );
  }

  upsertEmergencyContact(params: UpsertEmergencyContactParams): Observable<boolean> {
    const payload: UpsertEmergencyContactRequestDto = {
      id: params.id,
      name: params.name,
      relationship: params.relationship,
      phoneNumber: params.phoneNumber,
      alternativePhoneNumber: params.alternativePhoneNumber,
      isPrimary: params.isPrimary
    };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/${params.employeeId}/emergency-contacts`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to save emergency contact.');
        }
        return response.data ?? true;
      })
    );
  }

  upsertBankDetails(params: UpsertBankDetailsParams): Observable<boolean> {
    const payload: UpsertBankDetailsRequestDto = {
      id: params.id,
      bankName: params.bankName,
      accountNumber: params.accountNumber,
      accountHolderName: params.accountHolderName,
      branchCode: params.branchCode,
      swiftCode: params.swiftCode,
      isPrimary: params.isPrimary
    };

    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/${params.employeeId}/bank-details`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to save bank details.');
        }
        return response.data ?? true;
      })
    );
  }

  exportEmployees(): Observable<Employee[]> {
    return this.http.get<ApiResponse<EmployeeDto[]>>(`${this.baseUrl}/export`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to export employees.');
        }
        return response.data.map(e => EmployeeMapper.fromEmployeeDto(e));
      })
    );
  }
}
