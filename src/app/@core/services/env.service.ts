import { Injectable } from '@angular/core';
import { EnvData, EnvEdit, EnvPageQuery, EnvVO } from '../data/env';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class EnvService extends EnvData {

  baseUrl = '/env';

  constructor(private apiService: ApiService) {
    super();
  }

  addEnv(param: EnvEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteEnvById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryEnvPage(param: EnvPageQuery): Observable<DataTable<EnvVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setEnvValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateTag(param: EnvEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
