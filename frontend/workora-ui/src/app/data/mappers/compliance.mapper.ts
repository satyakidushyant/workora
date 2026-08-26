import { StatutorySummaryDto, TaxDeclarationDto, StatutoryExportFileDto } from '../dtos/compliance.dto';
import { StatutorySummary, TaxDeclaration, StatutoryExportFile } from '../../domain/models/compliance.model';

export class ComplianceMapper {
  static fromSummaryDto(dto: StatutorySummaryDto): StatutorySummary {
    return {
      month: dto.month,
      year: dto.year,
      eligibleEmployeesCount: dto.eligibleEmployeesCount,
      totalEmployeePf: dto.totalEmployeePf,
      totalEmployerPf: dto.totalEmployerPf,
      totalEmployeeEsic: dto.totalEmployeeEsic,
      totalEmployerEsic: dto.totalEmployerEsic,
      totalProfessionalTax: dto.totalProfessionalTax,
      totalTdsDeducted: dto.totalTdsDeducted,
      totalStatutoryRemittance: dto.totalStatutoryRemittance
    };
  }

  static fromTaxDeclarationDto(dto: TaxDeclarationDto): TaxDeclaration {
    return {
      employeeId: dto.employeeId,
      financialYear: dto.financialYear,
      section80CAmount: dto.section80CAmount,
      section80DAmount: dto.section80DAmount,
      hraRentPaidAnnual: dto.hraRentPaidAnnual,
      homeLoanInterest: dto.homeLoanInterest,
      otherExemptions: dto.otherExemptions,
      declaredAt: dto.declaredAt
    };
  }

  static fromExportFileDto(dto: StatutoryExportFileDto): StatutoryExportFile {
    return {
      fileName: dto.fileName,
      contentType: dto.contentType,
      fileContentBase64: dto.fileContentBase64
    };
  }
}
