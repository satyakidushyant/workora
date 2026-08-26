import {
  EmployeeDto,
  EmployeeDetailDto,
  EmergencyContactDto,
  BankDetailDto,
  EmploymentHistoryDto,
  OrgChartNodeDto
} from '../dtos/employee.dto';
import {
  Employee,
  EmployeeDetail,
  EmergencyContact,
  BankDetail,
  EmploymentHistory,
  OrgChartNode
} from '../../domain/models/employee.model';

export class EmployeeMapper {
  static fromEmployeeDto(dto: EmployeeDto): Employee {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeCode: dto.employeeCode,
      firstName: dto.firstName,
      lastName: dto.lastName,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      nationalId: dto.nationalId,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      maritalStatus: dto.maritalStatus,
      hireDate: dto.hireDate,
      departmentId: dto.departmentId,
      departmentName: dto.departmentName,
      designationId: dto.designationId,
      designationTitle: dto.designationTitle,
      branchId: dto.branchId,
      branchName: dto.branchName,
      managerId: dto.managerId,
      managerName: dto.managerName,
      userId: dto.userId,
      employmentStatus: dto.employmentStatus,
      employmentType: dto.employmentType,
      terminationDate: dto.terminationDate,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromEmergencyContactDto(dto: EmergencyContactDto): EmergencyContact {
    return {
      id: dto.id,
      name: dto.name,
      relationship: dto.relationship,
      phoneNumber: dto.phoneNumber,
      alternativePhoneNumber: dto.alternativePhoneNumber,
      isPrimary: dto.isPrimary
    };
  }

  static fromBankDetailDto(dto: BankDetailDto): BankDetail {
    return {
      id: dto.id,
      bankName: dto.bankName,
      accountNumber: dto.accountNumber,
      accountHolderName: dto.accountHolderName,
      branchCode: dto.branchCode,
      swiftCode: dto.swiftCode,
      isPrimary: dto.isPrimary
    };
  }

  static fromEmploymentHistoryDto(dto: EmploymentHistoryDto): EmploymentHistory {
    return {
      id: dto.id,
      effectiveDate: dto.effectiveDate,
      eventType: dto.eventType,
      previousDepartmentId: dto.previousDepartmentId,
      newDepartmentId: dto.newDepartmentId,
      previousDesignationId: dto.previousDesignationId,
      newDesignationId: dto.newDesignationId,
      previousBranchId: dto.previousBranchId,
      newBranchId: dto.newBranchId,
      notes: dto.notes,
      createdAt: dto.createdAt
    };
  }

  static fromEmployeeDetailDto(dto: EmployeeDetailDto): EmployeeDetail {
    const base = this.fromEmployeeDto(dto);
    return {
      ...base,
      terminationReason: dto.terminationReason,
      address: dto.address,
      emergencyContacts: (dto.emergencyContacts || []).map(c => this.fromEmergencyContactDto(c)),
      bankDetails: (dto.bankDetails || []).map(b => this.fromBankDetailDto(b)),
      employmentHistory: (dto.employmentHistory || []).map(h => this.fromEmploymentHistoryDto(h))
    };
  }

  static fromOrgChartNodeDto(dto: OrgChartNodeDto): OrgChartNode {
    return {
      id: dto.id,
      employeeCode: dto.employeeCode,
      fullName: dto.fullName,
      designationTitle: dto.designationTitle,
      departmentName: dto.departmentName,
      managerId: dto.managerId,
      directReports: (dto.directReports || []).map(dr => this.fromOrgChartNodeDto(dr))
    };
  }
}
