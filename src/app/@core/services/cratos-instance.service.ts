import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  CratosInstanceData,
  CratosInstanceHealthVO,
  CratosInstanceVO,
  RegisteredInstancePageQuery,
} from '../data/cratos-instance';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class CratosInstanceService extends CratosInstanceData {

  baseUrl = '/instance';

  constructor(private apiService: ApiService) {
    super();
  }

  queryRegisteredInstancePage(param: RegisteredInstancePageQuery): Observable<DataTable<CratosInstanceVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setInstanceValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  deleteInstanceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

}
