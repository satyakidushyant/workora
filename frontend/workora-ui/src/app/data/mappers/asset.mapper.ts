import { AssetDto } from '../dtos/asset.dto';
import { Asset } from '../../domain/models/asset.model';

export class AssetMapper {
  static fromAssetDto(dto: AssetDto): Asset {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      name: dto.name,
      assetTag: dto.assetTag,
      serialNumber: dto.serialNumber,
      category: dto.category,
      status: dto.status,
      purchaseCost: dto.purchaseCost,
      purchaseDate: dto.purchaseDate,
      currentAssignedEmployeeName: dto.currentAssignedEmployeeName,
      currentAssignedEmployeeId: dto.currentAssignedEmployeeId,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }
}
