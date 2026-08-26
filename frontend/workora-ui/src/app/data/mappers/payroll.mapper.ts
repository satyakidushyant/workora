import {
  SalaryComponentDto,
  SalaryStructureDto,
  EmployeeSalaryAssignmentDto,
  PayslipItemDto,
  PayslipDto,
  PayrollRunDto,
  PayrollRunDetailDto,
  PayheadDto
} from '../dtos/payroll.dto';
import {
  SalaryComponent,
  SalaryStructure,
  EmployeeSalaryAssignment,
  PayslipItem,
  Payslip,
  PayrollRun,
  PayrollRunDetail,
  Payhead
} from '../../domain/models/payroll.model';

export class PayrollMapper {
  static fromSalaryComponentDto(dto: SalaryComponentDto): SalaryComponent {
    return {
      id: dto.id,
      salaryStructureId: dto.salaryStructureId,
      name: dto.name,
      code: dto.code,
      type: dto.type,
      calculationType: dto.calculationType,
      defaultValue: dto.defaultValue,
      isTaxable: dto.isTaxable
    };
  }

  static fromSalaryStructureDto(dto: SalaryStructureDto): SalaryStructure {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      name: dto.name,
      description: dto.description,
      components: (dto.components || []).map(c => this.fromSalaryComponentDto(c)),
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromAssignmentDto(dto: EmployeeSalaryAssignmentDto): EmployeeSalaryAssignment {
    return {
      id: dto.id,
      employeeId: dto.employeeId,
      salaryStructureId: dto.salaryStructureId,
      salaryStructureName: dto.salaryStructureName,
      baseSalary: dto.baseSalary,
      effectiveFrom: dto.effectiveFrom,
      effectiveTo: dto.effectiveTo,
      isActive: dto.isActive,
      components: (dto.components || []).map(c => this.fromSalaryComponentDto(c))
    };
  }

  static fromPayslipItemDto(dto: PayslipItemDto): PayslipItem {
    return {
      id: dto.id,
      componentName: dto.componentName,
      componentCode: dto.componentCode,
      type: dto.type,
      amount: dto.amount
    };
  }

  static fromPayslipDto(dto: PayslipDto): Payslip {
    return {
      id: dto.id,
      uuid: dto.uuid,
      payrollRunId: dto.payrollRunId,
      employeeId: dto.employeeId,
      employeeCode: dto.employeeCode,
      employeeName: dto.employeeName,
      grossSalary: dto.grossSalary,
      totalDeductions: dto.totalDeductions,
      netSalary: dto.netSalary,
      paymentStatus: dto.paymentStatus,
      paymentDate: dto.paymentDate,
      items: (dto.items || []).map(i => this.fromPayslipItemDto(i)),
      createdAt: dto.createdAt
    };
  }

  static fromRunDto(dto: PayrollRunDto): PayrollRun {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      periodMonth: dto.periodMonth,
      periodYear: dto.periodYear,
      status: dto.status,
      totalGrossPay: dto.totalGrossPay,
      totalDeductions: dto.totalDeductions,
      totalNetPay: dto.totalNetPay,
      totalEmployees: dto.totalEmployees,
      processedAt: dto.processedAt,
      approvedBy: dto.approvedBy,
      approvedAt: dto.approvedAt,
      disbursedAt: dto.disbursedAt,
      createdAt: dto.createdAt
    };
  }

  static fromRunDetailDto(dto: PayrollRunDetailDto): PayrollRunDetail {
    const base = this.fromRunDto(dto);
    return {
      ...base,
      payslips: (dto.payslips || []).map(p => this.fromPayslipDto(p))
    };
  }

  static fromPayheadDto(dto: PayheadDto): Payhead {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
      type: dto.type,
      calculationType: dto.calculationType,
      defaultValue: dto.defaultValue,
      isTaxable: dto.isTaxable
    };
  }
}
