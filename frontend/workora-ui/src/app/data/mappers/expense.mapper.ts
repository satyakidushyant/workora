import { ExpenseClaimDto } from '../dtos/expense.dto';
import { ExpenseClaim } from '../../domain/models/expense.model';

export class ExpenseMapper {
  static fromExpenseClaimDto(dto: ExpenseClaimDto): ExpenseClaim {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      category: dto.category,
      expenseDate: dto.expenseDate,
      amount: dto.amount,
      merchantName: dto.merchantName,
      description: dto.description,
      receiptUrl: dto.receiptUrl,
      status: dto.status,
      managerApprovedByUserId: dto.managerApprovedByUserId,
      managerApprovedAt: dto.managerApprovedAt,
      financeApprovedByUserId: dto.financeApprovedByUserId,
      financeApprovedAt: dto.financeApprovedAt,
      rejectionReason: dto.rejectionReason,
      payrollRunId: dto.payrollRunId,
      createdAt: dto.createdAt
    };
  }
}
