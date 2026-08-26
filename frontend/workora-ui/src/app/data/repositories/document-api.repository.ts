import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDocumentRepository } from '../../domain/repositories/i-document.repository';
import { DocumentItem, DocumentQueryParams, CreateDocumentParams } from '../../domain/models/document.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import { DocumentDto, CreateDocumentRequestDto } from '../dtos/document.dto';
import { DocumentMapper } from '../mappers/document.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiRepository implements IDocumentRepository {
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  constructor(private readonly http: HttpClient) {}

  getDocuments(params?: DocumentQueryParams): Observable<PagedResponse<DocumentItem>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.companyId) httpParams = httpParams.set('companyId', params.companyId.toString());
      if (params.employeeId) httpParams = httpParams.set('employeeId', params.employeeId.toString());
      if (params.category) httpParams = httpParams.set('category', params.category);
    }

    return this.http.get<ApiResponse<PagedResponse<DocumentDto>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch documents.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(d => DocumentMapper.fromDocumentDto(d)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || (params?.pageNumber || 1),
          pageSize: paged.pageSize || (params?.pageSize || 10),
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getDocumentById(id: number): Observable<DocumentItem> {
    return this.http.get<ApiResponse<DocumentDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch document #${id}.`);
        }
        return DocumentMapper.fromDocumentDto(response.data);
      })
    );
  }

  createDocument(params: CreateDocumentParams): Observable<DocumentItem> {
    const payload: CreateDocumentRequestDto = {
      companyId: params.companyId,
      employeeId: params.employeeId,
      title: params.title,
      fileName: params.fileName,
      filePath: params.filePath,
      contentType: params.contentType,
      fileSizeBytes: params.fileSizeBytes,
      category: params.category
    };

    return this.http.post<ApiResponse<DocumentDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to save document.');
        }
        return DocumentMapper.fromDocumentDto(response.data);
      })
    );
  }

  deleteDocument(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete document.');
        }
        return response.data ?? true;
      })
    );
  }

  getExpiringDocuments(companyId: number): Observable<DocumentItem[]> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<ApiResponse<DocumentDto[]>>(`${this.baseUrl}/expiring`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch expiring documents.');
        }
        return response.data.map(d => DocumentMapper.fromDocumentDto(d));
      })
    );
  }
}
