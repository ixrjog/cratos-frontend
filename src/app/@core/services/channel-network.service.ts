import { ApiService } from './api.service';
import {
  ChannelNetworkData,
  ChannelNetworkEdit,
  ChannelNetworkPageQuery,
  ChannelNetworkVO,
} from '../data/channel-network';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { Injectable } from '@angular/core';

@Injectable()
export class ChannelNetworkService extends ChannelNetworkData {

  baseUrl = '/channel/network';

  constructor(private apiService: ApiService) {
    super();
  }

  addChannelNetwork(param: ChannelNetworkEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteChannelNetworkById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryChannelNetworkPage(param: ChannelNetworkPageQuery): Observable<DataTable<ChannelNetworkVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setChannelNetworkValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateChannelNetwork(param: ChannelNetworkEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }
}
