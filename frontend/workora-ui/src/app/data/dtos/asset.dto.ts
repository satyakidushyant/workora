export interface AssetDto {
  id: number;
  uuid: string;
  companyId: number;
  name: string;
  assetTag: string;
  serialNumber?: string | null;
  category: string;
  status: string;
  purchaseCost?: number | null;
  purchaseDate?: string | null;
  currentAssignedEmployeeName?: string | null;
  currentAssignedEmployeeId?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAssetRequestDto {
  companyId: number;
  name: string;
  assetTag: string;
  category: string;
  serialNumber?: string | null;
  purchaseCost?: number | null;
  purchaseDate?: string | null;
}

export interface AssignAssetRequestDto {
  assetId: number;
  employeeId: number;
  assignedDate: string;
}

export interface ReturnAssetRequestDto {
  assetId: number;
  returnedDate: string;
  condition?: string | null;
}
