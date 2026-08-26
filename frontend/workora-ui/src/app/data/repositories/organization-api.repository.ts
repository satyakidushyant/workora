import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IOrganizationRepository } from '../../domain/repositories/i-organization.repository';
import {
  Company,
  UpdateCompanyProfileParams,
  Branch,
  BranchQueryParams,
  CreateBranchParams,
  UpdateBranchParams,
  Department,
  DepartmentDetail,
  DepartmentQueryParams,
  CreateDepartmentParams,
  UpdateDepartmentParams,
  AssignDepartmentHeadParams,
  Designation,
  DesignationQueryParams,
  CreateDesignationParams,
  UpdateDesignationParams
} from '../../domain/models/organization.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  CompanyDto,
  UpdateCompanyProfileRequestDto,
  UploadCompanyLogoRequestDto,
  BranchDto,
  CreateBranchRequestDto,
  UpdateBranchRequestDto,
  DepartmentDto,
  DepartmentDetailDto,
  CreateDepartmentRequestDto,
  UpdateDepartmentRequestDto,
  AssignDepartmentHeadRequestDto,
  DesignationDto,
  CreateDesignationRequestDto,
  UpdateDesignationRequestDto
} from '../dtos/organization.dto';
import { OrganizationMapper } from '../mappers/organization.mapper';
import { environment } from '../../../environments/environment';

/**
 * Concrete implementation of IOrganizationRepository executing HTTP API requests against Workora backend.
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationApiRepository implements IOrganizationRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // ==========================================
  // Company Endpoints
  // ==========================================

  getCompanyProfile(id?: number): Observable<Company> {
    let params = new HttpParams();
    if (id !== undefined && id !== null) {
      params = params.set('id', id.toString());
    }

    return this.http.get<ApiResponse<CompanyDto>>(`${this.baseUrl}/company`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch company profile.');
        }
        return OrganizationMapper.fromCompanyDto(response.data);
      })
    );
  }

  updateCompanyProfile(params: UpdateCompanyProfileParams): Observable<Company> {
    let httpParams = new HttpParams();
    if (params.id !== undefined && params.id !== null) {
      httpParams = httpParams.set('id', params.id.toString());
    }

    const payload: UpdateCompanyProfileRequestDto = {
      name: params.name,
      registrationNumber: params.registrationNumber,
      taxId: params.taxId,
      email: params.email,
      phone: params.phone,
      website: params.website,
      fiscalYearStartMonth: params.fiscalYearStartMonth,
      currency: params.currency,
      address: params.address
    };

    return this.http.put<ApiResponse<CompanyDto>>(`${this.baseUrl}/company`, payload, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update company profile.');
        }
        return OrganizationMapper.fromCompanyDto(response.data);
      })
    );
  }

  uploadCompanyLogo(logoUrl: string, id?: number): Observable<boolean> {
    let httpParams = new HttpParams();
    if (id !== undefined && id !== null) {
      httpParams = httpParams.set('id', id.toString());
    }

    const payload: UploadCompanyLogoRequestDto = { logoUrl };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/company/logo`, payload, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to update company logo.');
        }
        return response.data ?? true;
      })
    );
  }

  getCompaniesList(): Observable<Company[]> {
    return this.http.get<ApiResponse<CompanyDto[]>>(`${this.baseUrl}/companies`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch companies list.');
        }
        return response.data.map(dto => OrganizationMapper.fromCompanyDto(dto));
      })
    );
  }

  // ==========================================
  // Branch Endpoints
  // ==========================================

  getBranches(params?: BranchQueryParams): Observable<PagedResponse<Branch>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.companyId) httpParams = httpParams.set('companyId', params.companyId.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<BranchDto>>>(`${this.baseUrl}/branches`, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch branches list.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(b => OrganizationMapper.fromBranchDto(b)),
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

  getBranchById(id: number): Observable<Branch> {
    return this.http.get<ApiResponse<BranchDto>>(`${this.baseUrl}/branches/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch branch #${id}.`);
        }
        return OrganizationMapper.fromBranchDto(response.data);
      })
    );
  }

  createBranch(params: CreateBranchParams): Observable<Branch> {
    const payload: CreateBranchRequestDto = {
      companyId: params.companyId,
      name: params.name,
      code: params.code,
      location: params.location,
      address: params.address,
      timezone: params.timezone,
      isHeadOffice: params.isHeadOffice
    };

    return this.http.post<ApiResponse<BranchDto>>(`${this.baseUrl}/branches`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create branch.');
        }
        return OrganizationMapper.fromBranchDto(response.data);
      })
    );
  }

  updateBranch(params: UpdateBranchParams): Observable<Branch> {
    const payload: UpdateBranchRequestDto = {
      name: params.name,
      code: params.code,
      location: params.location,
      address: params.address,
      timezone: params.timezone,
      isHeadOffice: params.isHeadOffice
    };

    return this.http.put<ApiResponse<BranchDto>>(`${this.baseUrl}/branches/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update branch.');
        }
        return OrganizationMapper.fromBranchDto(response.data);
      })
    );
  }

  deleteBranch(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/branches/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete branch.');
        }
        return response.data ?? true;
      })
    );
  }

  // ==========================================
  // Department Endpoints
  // ==========================================

  getDepartments(params?: DepartmentQueryParams): Observable<PagedResponse<Department>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.companyId) httpParams = httpParams.set('companyId', params.companyId.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<DepartmentDto>>>(`${this.baseUrl}/departments`, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch departments list.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(d => OrganizationMapper.fromDepartmentDto(d)),
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

  getDepartmentById(id: number): Observable<DepartmentDetail> {
    return this.http.get<ApiResponse<DepartmentDetailDto>>(`${this.baseUrl}/departments/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch department #${id}.`);
        }
        return OrganizationMapper.fromDepartmentDetailDto(response.data);
      })
    );
  }

  createDepartment(params: CreateDepartmentParams): Observable<Department> {
    const payload: CreateDepartmentRequestDto = {
      companyId: params.companyId,
      code: params.code,
      name: params.name,
      headEmployeeId: params.headEmployeeId,
      parentDepartmentId: params.parentDepartmentId
    };

    return this.http.post<ApiResponse<DepartmentDto>>(`${this.baseUrl}/departments`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create department.');
        }
        return OrganizationMapper.fromDepartmentDto(response.data);
      })
    );
  }

  updateDepartment(params: UpdateDepartmentParams): Observable<Department> {
    const payload: UpdateDepartmentRequestDto = {
      code: params.code,
      name: params.name,
      headEmployeeId: params.headEmployeeId,
      parentDepartmentId: params.parentDepartmentId
    };

    return this.http.put<ApiResponse<DepartmentDto>>(`${this.baseUrl}/departments/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update department.');
        }
        return OrganizationMapper.fromDepartmentDto(response.data);
      })
    );
  }

  assignDepartmentHead(params: AssignDepartmentHeadParams): Observable<Department> {
    const payload: AssignDepartmentHeadRequestDto = {
      headEmployeeId: params.headEmployeeId
    };

    return this.http.patch<ApiResponse<DepartmentDto>>(`${this.baseUrl}/departments/${params.departmentId}/assign-head`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to assign department head.');
        }
        return OrganizationMapper.fromDepartmentDto(response.data);
      })
    );
  }

  deleteDepartment(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/departments/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete department.');
        }
        return response.data ?? true;
      })
    );
  }

  // ==========================================
  // Designation Endpoints
  // ==========================================

  getDesignations(params?: DesignationQueryParams): Observable<PagedResponse<Designation>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.departmentId) httpParams = httpParams.set('departmentId', params.departmentId.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<DesignationDto>>>(`${this.baseUrl}/designations`, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch designations list.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(d => OrganizationMapper.fromDesignationDto(d)),
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

  getDesignationById(id: number): Observable<Designation> {
    return this.http.get<ApiResponse<DesignationDto>>(`${this.baseUrl}/designations/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch designation #${id}.`);
        }
        return OrganizationMapper.fromDesignationDto(response.data);
      })
    );
  }

  createDesignation(params: CreateDesignationParams): Observable<Designation> {
    const payload: CreateDesignationRequestDto = {
      departmentId: params.departmentId,
      title: params.title,
      level: params.level,
      grade: params.grade,
      description: params.description
    };

    return this.http.post<ApiResponse<DesignationDto>>(`${this.baseUrl}/designations`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create designation.');
        }
        return OrganizationMapper.fromDesignationDto(response.data);
      })
    );
  }

  updateDesignation(params: UpdateDesignationParams): Observable<Designation> {
    const payload: UpdateDesignationRequestDto = {
      departmentId: params.departmentId,
      title: params.title,
      level: params.level,
      grade: params.grade,
      description: params.description
    };

    return this.http.put<ApiResponse<DesignationDto>>(`${this.baseUrl}/designations/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update designation.');
        }
        return OrganizationMapper.fromDesignationDto(response.data);
      })
    );
  }

  deleteDesignation(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/designations/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete designation.');
        }
        return response.data ?? true;
      })
    );
  }
}
