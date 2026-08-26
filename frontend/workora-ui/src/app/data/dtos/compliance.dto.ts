export interface StatutorySummaryDto {
  month: number;
  year: number;
  eligibleEmployeesCount: number;
  totalEmployeePf: number;
  totalEmployerPf: number;
  totalEmployeeEsic: number;
  totalEmployerEsic: number;
  totalProfessionalTax: number;
  totalTdsDeducted: number;
  totalStatutoryRemittance: number;
}

export interface TaxDeclarationDto {
  employeeId: number;
  financialYear: string;
  section80CAmount: number;
  section80DAmount: number;
  hraRentPaidAnnual: number;
  homeLoanInterest: number;
  otherExemptions: number;
  declaredAt: string;
}

export interface StatutoryExportFileDto {
  fileName: string;
  contentType: string;
  fileContentBase64: string;
}

export interface DeclareTaxInvestmentRequestDto {
  employeeId: number;
  financialYear: string;
  section80CAmount: number;
  section80DAmount: number;
  hraRentPaidAnnual: number;
  homeLoanInterest: number;
  otherExemptions: number;
}
