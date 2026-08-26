export interface StatutorySummary {
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

export interface TaxDeclaration {
  employeeId: number;
  financialYear: string;
  section80CAmount: number;
  section80DAmount: number;
  hraRentPaidAnnual: number;
  homeLoanInterest: number;
  otherExemptions: number;
  declaredAt: string;
}

export interface StatutoryExportFile {
  fileName: string;
  contentType: string;
  fileContentBase64: string;
}

export interface SubmitTaxDeclarationParams {
  employeeId: number;
  financialYear: string;
  section80CAmount: number;
  section80DAmount: number;
  hraRentPaidAnnual: number;
  homeLoanInterest: number;
  otherExemptions: number;
}
