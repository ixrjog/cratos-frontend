import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class DatacenterService {

  baseUrl = '/datacenter';

  constructor(private apiService: ApiService) {
  }

  queryNetworkPage(param: any): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/network/page/query', param);
  }

  addNetwork(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/network/add', param);
  }

  updateNetwork(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/network/update', param);
  }

  queryAllocationPage(param: any): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/allocation/page/query', param);
  }

  addAllocation(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/allocation/add', param);
  }

  updateAllocation(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/allocation/update', param);
  }

  deleteAllocationById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/allocation/del', param);
  }

  checkCidrConflict(param: any): Observable<HttpResult<any>> {
    return this.apiService.post(this.baseUrl, '/allocation/cidr/conflict/check', param);
  }

  findAvailableCidrs(param: any): Observable<HttpResult<any>> {
    return this.apiService.post(this.baseUrl, '/allocation/cidr/available/find', param);
  }

  getSubnetMap(param: { parentCidr: string, prefixLength: number }): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/allocation/subnet/map/get', param);
  }

  queryAllocationsByCidr(param: { cidr: string }): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/allocation/cidr/query', param);
  }

  scanNetworkAllocation(param: { networkId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/network/allocation/scan', param);
  }

}
