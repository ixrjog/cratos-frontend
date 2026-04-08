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

}
