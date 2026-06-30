import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { ApiService } from './api.service';
import {
  ChannelRouteAddLine,
  ChannelRouteCallSaveParam,
  ChannelRouteConfigData,
  ChannelRouteConfigEdit,
  ChannelRouteConfigPageQuery,
  ChannelRouteConfigVO,
  ChannelRouteLineVO,
} from '../data/channel-route-config';
import { DataTable } from '../data/base-data';

@Injectable()
export class ChannelRouteConfigService extends ChannelRouteConfigData {

  baseUrl = '/channel/route/config';

  constructor(private apiService: ApiService) {
    super();
  }

  getRouteConfig(param: { channelId: number }): Observable<HttpResult<ChannelRouteConfigVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  queryChannelRouteConfigPage(param: ChannelRouteConfigPageQuery): Observable<DataTable<ChannelRouteConfigVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addChannelRouteConfig(param: ChannelRouteConfigEdit): Observable<HttpResult<boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateChannelRouteConfig(param: ChannelRouteConfigEdit): Observable<HttpResult<boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  callSaveConfig(param: ChannelRouteCallSaveParam): Observable<HttpResult<boolean>> {
    return this.apiService.post(this.baseUrl, '/save/call', param);
  }

  queryChannelRouteConfigLine(param: { routeConfigId: number }): Observable<HttpResult<ChannelRouteLineVO[]>> {
    return this.apiService.post(this.baseUrl, '/line/query', param);
  }

  addLine(param: ChannelRouteAddLine): Observable<HttpResult<boolean>> {
    return this.apiService.post(this.baseUrl, '/line/add', param);
  }
}
