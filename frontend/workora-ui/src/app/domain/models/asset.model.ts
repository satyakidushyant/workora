/**
 * Domain model representing a company asset or equipment.
 */
export interface Asset {
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

/**
 * Query parameters for fetching assets.
 */
export interface AssetQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  companyId?: number;
  category?: string;
  status?: string;
  employeeId?: number;
}

/**
 * Parameters for creating an asset.
 */
export interface CreateAssetParams {
  companyId: number;
  name: string;
  assetTag: string;
  category: string;
  serialNumber?: string | null;
  purchaseCost?: number | null;
  purchaseDate?: string | null;
}

/**
 * Parameters for checking out / assigning an asset.
 */
export interface AssignAssetParams {
  assetId: number;
  employeeId: number;
  assignedDate: string;
}

/**
 * Parameters for returning an asset.
 */
export interface ReturnAssetParams {
  assetId: number;
  returnedDate: string;
  condition?: string | null;
}
