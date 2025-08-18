import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GetGroupOptions, TagGroupAssetPageQuery, TagGroupData } from '../data/tag-group';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { EdsAssetVO } from '../data/ext-datasource';

@Injectable()
export class TagGroupService extends TagGroupData {

  baseUrl = '/tag/group';

  constructor(private apiService: ApiService) {
    super();
  }

  getGroupOptions(param: GetGroupOptions): Observable<HttpResult<OptionsVO>> {
    return this.apiService.post(this.baseUrl, '/options/get', param);
  }

  queryTagGroupAssetPage(param: TagGroupAssetPageQuery): Observable<DataTable<EdsAssetVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  getMyGroupOptions(param: GetGroupOptions): Observable<HttpResult<OptionsVO>> {
    return this.apiService.post(this.baseUrl, '/my/options/get', param);
  }

  queryMyGroupAssetPage(param: TagGroupAssetPageQuery): Observable<DataTable<EdsAssetVO>> {
    return this.apiService.post(this.baseUrl, '/my/page/query', param);
  }

}
