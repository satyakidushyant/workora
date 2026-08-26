import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import { Asset, AssetQueryParams, CreateAssetParams, AssignAssetParams, ReturnAssetParams } from '../models/asset.model';

/**
 * Repository interface for company Asset and equipment operations.
 */
export interface IAssetRepository {
  getAssets(params?: AssetQueryParams): Observable<PagedResponse<Asset>>;
  getAssetById(id: number): Observable<Asset>;
  createAsset(params: CreateAssetParams): Observable<Asset>;
  assignAsset(params: AssignAssetParams): Observable<boolean>;
  returnAsset(params: ReturnAssetParams): Observable<boolean>;
  getMyAssets(): Observable<Asset[]>;
}
