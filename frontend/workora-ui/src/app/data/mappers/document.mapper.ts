import { DocumentDto } from '../dtos/document.dto';
import { DocumentItem } from '../../domain/models/document.model';

export class DocumentMapper {
  static fromDocumentDto(dto: DocumentDto): DocumentItem {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      title: dto.title,
      fileName: dto.fileName,
      filePath: dto.filePath,
      contentType: dto.contentType,
      fileSizeBytes: dto.fileSizeBytes,
      category: dto.category,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }
}
