/**
 * Domain model representing an organizational or employee document record.
 */
export interface DocumentItem {
  id: number;
  uuid: string;
  companyId: number;
  employeeId?: number | null;
  employeeName?: string | null;
  title: string;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSizeBytes: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Query parameters for document list.
 */
export interface DocumentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  companyId?: number;
  employeeId?: number;
  category?: string;
  searchTerm?: string;
}

/**
 * Parameters for recording an uploaded document.
 */
export interface CreateDocumentParams {
  companyId: number;
  employeeId?: number | null;
  title: string;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSizeBytes: number;
  category: string;
}
