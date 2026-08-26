export interface DocumentDto {
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

export interface CreateDocumentRequestDto {
  companyId: number;
  employeeId?: number | null;
  title: string;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSizeBytes: number;
  category: string;
}
