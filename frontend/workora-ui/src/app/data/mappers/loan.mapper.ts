import { LoanDto, LoanEmiScheduleDto } from '../dtos/loan.dto';
import { Loan, LoanEmiSchedule } from '../../domain/models/loan.model';

export class LoanMapper {
  static fromEmiScheduleDto(dto: LoanEmiScheduleDto): LoanEmiSchedule {
    return {
      id: dto.id,
      uuid: dto.uuid,
      loanRecordId: dto.loanRecordId,
      installmentNumber: dto.installmentNumber,
      dueDate: dto.dueDate,
      emiAmount: dto.emiAmount,
      principalComponent: dto.principalComponent,
      interestComponent: dto.interestComponent,
      isPaid: dto.isPaid,
      paidAt: dto.paidAt,
      payrollRunId: dto.payrollRunId
    };
  }

  static fromLoanDto(dto: LoanDto): Loan {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      loanType: dto.loanType,
      principalAmount: dto.principalAmount,
      tenureMonths: dto.tenureMonths,
      monthlyEmi: dto.monthlyEmi,
      totalRepaid: dto.totalRepaid,
      remainingBalance: dto.remainingBalance,
      disbursementDate: dto.disbursementDate,
      status: dto.status,
      reason: dto.reason,
      approvedByUserId: dto.approvedByUserId,
      approvedAt: dto.approvedAt,
      rejectionReason: dto.rejectionReason,
      createdAt: dto.createdAt
    };
  }
}
