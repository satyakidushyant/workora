import { Observable } from 'rxjs';
import { StatutorySummary, TaxDeclaration, StatutoryExportFile, SubmitTaxDeclarationParams } from '../models/compliance.model';

export interface IComplianceRepository {
  getStatutorySummary(month: number, year: number, companyId?: number): Observable<StatutorySummary>;
  exportEpfEcr(month: number, year: number, companyId?: number): Observable<StatutoryExportFile>;
  exportEsicReturn(month: number, year: number, companyId?: number): Observable<StatutoryExportFile>;
  exportPtReturn(month: number, year: number, companyId?: number): Observable<StatutoryExportFile>;
  declareTaxInvestment(params: SubmitTaxDeclarationParams): Observable<TaxDeclaration>;
  generateForm16(employeeId: number, financialYear?: string): Observable<StatutoryExportFile>;
}
