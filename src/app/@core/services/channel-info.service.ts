import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { ApiService } from './api.service';
import { ChannelInfoData, ChannelInfoEdit, ChannelInfoPageQuery, ChannelInfoVO } from '../data/channel-info';

@Injectable()
export class ChannelInfoService extends ChannelInfoData {

  baseUrl = '/channel';

  constructor(private apiService: ApiService) {
    super();
  }

  queryChannelPage(param: ChannelInfoPageQuery): Observable<DataTable<ChannelInfoVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addChannel(param: ChannelInfoEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateChannel(param: ChannelInfoEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteChannelById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setChannelValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  addChannelExtension(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/extension/add', param);
  }

  queryChannelExtensions(param: { channelId: number }): Observable<HttpResult<any[]>> {
    return this.apiService.get(this.baseUrl, '/extension/query', param);
  }

  deleteChannelExtensionById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/extension/del', param);
  }

  callChannelAlert(param: { channelId: number; usernames: string[] }): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/alert/call', param);
  }
}

  getCountryOptions(): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/country/options/get');
  }
