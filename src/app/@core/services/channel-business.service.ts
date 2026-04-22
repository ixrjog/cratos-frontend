import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { ApiService } from './api.service';
import { ChannelBusinessEdit, ChannelBusinessPageQuery, ChannelBusinessVO } from '../data/channel-business';

@Injectable()
export class ChannelBusinessService {

  baseUrl = '/channel/business';

  constructor(private apiService: ApiService) {
  }

  queryChannelBusinessPage(param: ChannelBusinessPageQuery): Observable<DataTable<ChannelBusinessVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addChannelBusiness(param: ChannelBusinessEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateChannelBusiness(param: ChannelBusinessEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteChannelBusinessById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setChannelBusinessValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  getBusinessTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/type/options/get', {});
  }
}
