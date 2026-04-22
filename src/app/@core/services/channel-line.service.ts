import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { ApiService } from './api.service';
import { ChannelLineEdit, ChannelLinePageQuery, ChannelLineVO } from '../data/channel-line';

@Injectable()
export class ChannelLineService {

  baseUrl = '/channel/line';
  bizLineUrl = '/channel/business/line';

  constructor(private apiService: ApiService) {
  }

  queryChannelLinePage(param: ChannelLinePageQuery): Observable<DataTable<ChannelLineVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addChannelLine(param: ChannelLineEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateChannelLine(param: ChannelLineEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteChannelLineById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setChannelLineValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  // Business Line
  queryChannelBusinessLines(param: { channelBusinessId: number }): Observable<HttpResult<any[]>> {
    return this.apiService.get(this.bizLineUrl, '/query', param);
  }

  addChannelBusinessLine(param: { channelBusinessId: number; channelLineId: number; valid: boolean; comment: string }): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.bizLineUrl, '/add', param);
  }

  deleteChannelBusinessLineById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.bizLineUrl, '/del', param);
  }
}
