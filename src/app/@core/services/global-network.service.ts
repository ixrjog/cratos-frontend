import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { Injectable } from '@angular/core';
import {
  GlobalNetworkData,
  GlobalNetworkEdit,
  GlobalNetworkPageQuery,
  GlobalNetworkPlanningEdit,
  GlobalNetworkPlanningPageQuery,
  GlobalNetworkPlanningVO,
  GlobalNetworkSubnetEdit,
  GlobalNetworkSubnetPageQuery,
  GlobalNetworkSubnetVO,
  GlobalNetworkVO,
} from '../data/global-network';

@Injectable()
export class GlobalNetworkService extends GlobalNetworkData {

  baseUrl = '/global/network';

  constructor(private apiService: ApiService) {
    super();
  }

  addGlobalNetwork(param: GlobalNetworkEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  addGlobalNetworkPlanning(param: GlobalNetworkPlanningEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/planning/add', param);
  }

  deleteGlobalNetworkById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  deleteGlobalNetworkPlanningById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/planning/del', param);
  }

  queryGlobalNetworkPage(param: GlobalNetworkPageQuery): Observable<DataTable<GlobalNetworkVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  queryGlobalNetworkPlanningPage(param: GlobalNetworkPlanningPageQuery): Observable<DataTable<GlobalNetworkPlanningVO>> {
    return this.apiService.post(this.baseUrl, '/planning/page/query', param);
  }

  updateGlobalNetwork(param: GlobalNetworkEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  updateGlobalNetworkPlanning(param: GlobalNetworkPlanningEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/planning/update', param);
  }

  addGlobalNetworkSubnet(param: GlobalNetworkSubnetEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/subnet/add', param);
  }

  deleteGlobalNetworkSubnetById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/subnet/del', param);
  }

  queryGlobalNetworkSubnetPage(param: GlobalNetworkSubnetPageQuery): Observable<DataTable<GlobalNetworkSubnetVO>> {
    return this.apiService.post(this.baseUrl, '/subnet/page/query', param);
  }

  setGlobalNetworkSubnetValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/subnet/valid/set', param);
  }

  updateGlobalNetworkSubnet(param: GlobalNetworkSubnetEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/subnet/update', param);
  }
}
