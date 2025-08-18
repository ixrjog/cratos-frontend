import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO, PageQuery } from './base-data';
import { EdsAssetVO } from './ext-datasource';

export interface GetGroupOptions {
  queryName: string;
}

export interface TagGroupAssetPageQuery extends PageQuery {
  tagGroup: string;
  queryName: string;
}

export abstract class TagGroupData {

  abstract getGroupOptions(param: GetGroupOptions): Observable<HttpResult<OptionsVO>>;

  abstract queryTagGroupAssetPage(param: TagGroupAssetPageQuery): Observable<DataTable<EdsAssetVO>>;

  abstract getMyGroupOptions(param: GetGroupOptions): Observable<HttpResult<OptionsVO>>;

  abstract queryMyGroupAssetPage(param: TagGroupAssetPageQuery): Observable<DataTable<EdsAssetVO>>;

}
