import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import { DocumentItem, DocumentQueryParams, CreateDocumentParams } from '../models/document.model';

/**
 * Repository interface for Document operations.
 */
export interface IDocumentRepository {
  getDocuments(params?: DocumentQueryParams): Observable<PagedResponse<DocumentItem>>;
  getDocumentById(id: number): Observable<DocumentItem>;
  createDocument(params: CreateDocumentParams): Observable<DocumentItem>;
  deleteDocument(id: number): Observable<boolean>;
  getExpiringDocuments(companyId: number): Observable<DocumentItem[]>;
}
