import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';

export interface AssetMaturityVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  itemType: string;
  subscriptionTime: Date;
  expiry: Date;
  autoRenewal: boolean;
  comment: string;
}

export interface AssetMaturityPageQuery extends PageQuery {
  queryName: string;
}

export interface AssetMaturityEdit {
  id?: number;
  name: string;
  itemType: string;
  subscriptionTime: any;
  expiry: any;
  autoRenewal: boolean;
  valid: boolean;
  comment: string;
}

export abstract class AssetMaturityData {

  abstract queryAssetMaturityPage(param: AssetMaturityPageQuery): Observable<DataTable<AssetMaturityVO>>;

  abstract updateAssetMaturity(param: AssetMaturityEdit): Observable<HttpResult<Boolean>>;

  abstract addAssetMaturity(param: AssetMaturityEdit): Observable<HttpResult<Boolean>>;

  abstract deleteAssetMaturityById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setAssetMaturityValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
