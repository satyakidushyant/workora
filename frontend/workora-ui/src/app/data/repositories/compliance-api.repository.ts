import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IComplianceRepository } from '../../domain/repositories/i-compliance.repository';
import { StatutorySummary, TaxDeclaration, StatutoryExportFile, SubmitTaxDeclarationParams } from '../../domain/models/compliance.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { StatutorySummaryDto, TaxDeclarationDto, StatutoryExportFileDto, DeclareTaxInvestmentRequestDto } from '../dtos/compliance.dto';
import { ComplianceMapper } from '../mappers/compliance.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplianceApiRepository implements IComplianceRepository {
  private readonly baseUrl = `${environment.apiUrl}/compliance`;

  constructor(private readonly http: HttpClient) {}

  getStatutorySummary(month: number, year: number, companyId?: number): Observable<StatutorySummary> {
    let params = new HttpParams().set('month', month.toString()).set('year', year.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<StatutorySummaryDto>>(`${this.baseUrl}/summary`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch statutory summary.');
        }
        return ComplianceMapper.fromSummaryDto(response.data);
      })
    );
  }

  exportEpfEcr(month: number, year: number, companyId?: number): Observable<StatutoryExportFile> {
    let params = new HttpParams().set('month', month.toString()).set('year', year.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<StatutoryExportFileDto>>(`${this.baseUrl}/epf/ecr`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to generate EPF ECR export.');
        }
        return ComplianceMapper.fromExportFileDto(response.data);
      })
    );
  }

  exportEsicReturn(month: number, year: number, companyId?: number): Observable<StatutoryExportFile> {
    let params = new HttpParams().set('month', month.toString()).set('year', year.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<StatutoryExportFileDto>>(`${this.baseUrl}/esic/monthly-return`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to generate ESIC return export.');
        }
        return ComplianceMapper.fromExportFileDto(response.data);
      })
    );
  }

  exportPtReturn(month: number, year: number, companyId?: number): Observable<StatutoryExportFile> {
    let params = new HttpParams().set('month', month.toString()).set('year', year.toString());
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<StatutoryExportFileDto>>(`${this.baseUrl}/pt/return`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to generate PT return export.');
        }
        return ComplianceMapper.fromExportFileDto(response.data);
      })
    );
  }

  declareTaxInvestment(params: SubmitTaxDeclarationParams): Observable<TaxDeclaration> {
    const payload: DeclareTaxInvestmentRequestDto = {
      employeeId: params.employeeId,
      financialYear: params.financialYear,
      section80CAmount: params.section80CAmount,
      section80DAmount: params.section80DAmount,
      hraRentPaidAnnual: params.hraRentPaidAnnual,
      homeLoanInterest: params.homeLoanInterest,
      otherExemptions: params.otherExemptions
    };

    return this.http.post<ApiResponse<TaxDeclarationDto>>(`${this.baseUrl}/tax-declaration`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit tax declaration.');
        }
        return ComplianceMapper.fromTaxDeclarationDto(response.data);
      })
    );
  }

  generateForm16(employeeId: number, financialYear = '2025-2026'): Observable<StatutoryExportFile> {
    const params = new HttpParams().set('financialYear', financialYear);
    return this.http.get<ApiResponse<StatutoryExportFileDto>>(`${this.baseUrl}/tds/form16/${employeeId}`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to generate Form 16 for employee #${employeeId}.`);
        }
        return ComplianceMapper.fromExportFileDto(response.data);
      })
    );
  }
}
