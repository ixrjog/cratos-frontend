import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { ApiService } from './api.service';
import { ChannelNodeEdit, ChannelNodePageQuery, ChannelNodeVO } from '../data/channel-line';

@Injectable()
export class ChannelNodeService {

  baseUrl = '/channel/node';
  bizNodeUrl = '/channel/business/node';

  constructor(private apiService: ApiService) {
  }

  queryChannelNodePage(param: ChannelNodePageQuery): Observable<DataTable<ChannelNodeVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addChannelNode(param: ChannelNodeEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateChannelNode(param: ChannelNodeEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteChannelNodeById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setChannelNodeValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  // Business Node
  queryChannelBusinessNodes(param: { channelBusinessId: number }): Observable<HttpResult<any[]>> {
    return this.apiService.get(this.bizNodeUrl, '/query', param);
  }

  addChannelBusinessNode(param: { channelBusinessId: number; channelNodeId: number; valid: boolean; comment: string }): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.bizNodeUrl, '/add', param);
  }

  deleteChannelBusinessNodeById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.bizNodeUrl, '/del', param);
  }
}
