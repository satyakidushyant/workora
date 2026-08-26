import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAssetRepository } from '../../domain/repositories/i-asset.repository';
import { Asset, AssetQueryParams, CreateAssetParams, AssignAssetParams, ReturnAssetParams } from '../../domain/models/asset.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  AssetDto,
  CreateAssetRequestDto,
  AssignAssetRequestDto,
  ReturnAssetRequestDto
} from '../dtos/asset.dto';
import { AssetMapper } from '../mappers/asset.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetApiRepository implements IAssetRepository {
  private readonly baseUrl = `${environment.apiUrl}/assets`;

  constructor(private readonly http: HttpClient) {}

  getAssets(params?: AssetQueryParams): Observable<PagedResponse<Asset>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.companyId) httpParams = httpParams.set('companyId', params.companyId.toString());
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.employeeId) httpParams = httpParams.set('employeeId', params.employeeId.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<AssetDto>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch assets inventory.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(a => AssetMapper.fromAssetDto(a)),
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

  getAssetById(id: number): Observable<Asset> {
    return this.http.get<ApiResponse<AssetDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch asset #${id}.`);
        }
        return AssetMapper.fromAssetDto(response.data);
      })
    );
  }

  createAsset(params: CreateAssetParams): Observable<Asset> {
    const payload: CreateAssetRequestDto = {
      companyId: params.companyId,
      name: params.name,
      assetTag: params.assetTag,
      category: params.category,
      serialNumber: params.serialNumber,
      purchaseCost: params.purchaseCost,
      purchaseDate: params.purchaseDate
    };

    return this.http.post<ApiResponse<AssetDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create asset record.');
        }
        return AssetMapper.fromAssetDto(response.data);
      })
    );
  }

  assignAsset(params: AssignAssetParams): Observable<boolean> {
    const payload: AssignAssetRequestDto = {
      assetId: params.assetId,
      employeeId: params.employeeId,
      assignedDate: params.assignedDate
    };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/assign`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to assign asset.');
        }
        return response.data ?? true;
      })
    );
  }

  returnAsset(params: ReturnAssetParams): Observable<boolean> {
    const payload: ReturnAssetRequestDto = {
      assetId: params.assetId,
      returnedDate: params.returnedDate,
      condition: params.condition
    };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/return`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to return asset.');
        }
        return response.data ?? true;
      })
    );
  }

  getMyAssets(): Observable<Asset[]> {
    return this.http.get<ApiResponse<AssetDto[]>>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch assigned assets.');
        }
        return response.data.map(a => AssetMapper.fromAssetDto(a));
      })
    );
  }
}
