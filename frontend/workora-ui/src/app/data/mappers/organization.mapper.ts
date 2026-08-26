import {
  CompanyDto,
  BranchDto,
  DepartmentDto,
  DepartmentDetailDto,
  DesignationDto
} from '../dtos/organization.dto';
import {
  Company,
  Branch,
  Department,
  DepartmentDetail,
  Designation
} from '../../domain/models/organization.model';

/**
 * Pure mapper transforming between Organization DTOs and Domain Models.
 */
export class OrganizationMapper {
  /**
   * Maps CompanyDto to Company domain model.
   */
  static fromCompanyDto(dto: CompanyDto): Company {
    return {
      id: dto.id,
      uuid: dto.uuid,
      name: dto.name,
      code: dto.code,
      registrationNumber: dto.registrationNumber,
      taxId: dto.taxId,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
      logoUrl: dto.logoUrl,
      fiscalYearStartMonth: dto.fiscalYearStartMonth,
      currency: dto.currency,
      address: dto.address,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  /**
   * Maps BranchDto to Branch domain model.
   */
  static fromBranchDto(dto: BranchDto): Branch {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      companyName: dto.companyName,
      name: dto.name,
      code: dto.code,
      location: dto.location,
      address: dto.address,
      timezone: dto.timezone,
      isHeadOffice: dto.isHeadOffice,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  /**
   * Maps DepartmentDto to Department domain model.
   */
  static fromDepartmentDto(dto: DepartmentDto): Department {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      companyName: dto.companyName,
      code: dto.code,
      name: dto.name,
      headEmployeeId: dto.headEmployeeId,
      parentDepartmentId: dto.parentDepartmentId,
      parentDepartmentName: dto.parentDepartmentName,
      designationsCount: dto.designationsCount,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  /**
   * Maps DepartmentDetailDto to DepartmentDetail domain model.
   */
  static fromDepartmentDetailDto(dto: DepartmentDetailDto): DepartmentDetail {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      companyName: dto.companyName,
      code: dto.code,
      name: dto.name,
      headEmployeeId: dto.headEmployeeId,
      parentDepartmentId: dto.parentDepartmentId,
      parentDepartmentName: dto.parentDepartmentName,
      designationsCount: dto.designations?.length || 0,
      designations: (dto.designations || []).map(d => this.fromDesignationDto(d)),
      subDepartments: (dto.subDepartments || []).map(sd => this.fromDepartmentDto(sd)),
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  /**
   * Maps DesignationDto to Designation domain model.
   */
  static fromDesignationDto(dto: DesignationDto): Designation {
    return {
      id: dto.id,
      uuid: dto.uuid,
      departmentId: dto.departmentId,
      departmentName: dto.departmentName,
      title: dto.title,
      level: dto.level,
      grade: dto.grade,
      description: dto.description,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }
}
