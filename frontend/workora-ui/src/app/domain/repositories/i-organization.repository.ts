import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
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
} from '../models/organization.model';

/**
 * Repository interface for company, branch, department, and designation operations.
 */
export interface IOrganizationRepository {
  // Company
  getCompanyProfile(id?: number): Observable<Company>;
  updateCompanyProfile(params: UpdateCompanyProfileParams): Observable<Company>;
  uploadCompanyLogo(logoUrl: string, id?: number): Observable<boolean>;
  getCompaniesList(): Observable<Company[]>;

  // Branches
  getBranches(params?: BranchQueryParams): Observable<PagedResponse<Branch>>;
  getBranchById(id: number): Observable<Branch>;
  createBranch(params: CreateBranchParams): Observable<Branch>;
  updateBranch(params: UpdateBranchParams): Observable<Branch>;
  deleteBranch(id: number): Observable<boolean>;

  // Departments
  getDepartments(params?: DepartmentQueryParams): Observable<PagedResponse<Department>>;
  getDepartmentById(id: number): Observable<DepartmentDetail>;
  createDepartment(params: CreateDepartmentParams): Observable<Department>;
  updateDepartment(params: UpdateDepartmentParams): Observable<Department>;
  assignDepartmentHead(params: AssignDepartmentHeadParams): Observable<Department>;
  deleteDepartment(id: number): Observable<boolean>;

  // Designations
  getDesignations(params?: DesignationQueryParams): Observable<PagedResponse<Designation>>;
  getDesignationById(id: number): Observable<Designation>;
  createDesignation(params: CreateDesignationParams): Observable<Designation>;
  updateDesignation(params: UpdateDesignationParams): Observable<Designation>;
  deleteDesignation(id: number): Observable<boolean>;
}
