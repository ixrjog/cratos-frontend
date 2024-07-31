import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AssetMaturityData, AssetMaturityEdit, AssetMaturityPageQuery, AssetMaturityVO } from '../data/asset-maturity';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class AssetMaturityService extends AssetMaturityData {

  baseUrl = '/asset/maturity';

  constructor(private apiService: ApiService) {
    super();
  }

  addAssetMaturity(param: AssetMaturityEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteAssetMaturityById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryAssetMaturityPage(param: AssetMaturityPageQuery): Observable<DataTable<AssetMaturityVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setAssetMaturityValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateAssetMaturity(param: AssetMaturityEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
