import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class ApiSecurityRiskService {

  baseUrl = '/security';

  constructor(private apiService: ApiService) {
  }

  queryRiskPage(param: any): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/risk/page/query', param);
  }

  addRisk(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/risk/add', param);
  }

  updateRisk(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/risk/update', param);
  }

  deleteRiskById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/risk/del', param);
  }

  getReport(): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/risk/report/get', {});
  }

  callTestApi(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/risk/test/api/call', param);
  }

  getAutoSignMapYaml(): Observable<HttpResult<string>> {
    return this.apiService.get(this.baseUrl, '/risk/test/auto/sign/map/get', {});
  }

  saveAutoSignMap(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/risk/test/auto/sign/map/save', param);
  }

  queryTestRecordPage(param: any): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/risk/test/record/page/query', param);
  }

  getTestRecordSummary(id: number): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/risk/test/record/get', { id });
  }

}
