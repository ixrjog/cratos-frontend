import { Injectable } from '@angular/core';
import { EnvData, EnvEdit, EnvPageQuery, EnvVO } from '../data/env';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class EnvService extends EnvData {

  constructor(private apiService: ApiService) {
    super();
  }

  addEnv(param: EnvEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/env/add', param);
  }

  deleteEnvById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/env/del', param);
  }

  queryEnvPage(param: EnvPageQuery): Observable<DataTable<EnvVO>> {
    return this.apiService.post('/env/page/query', param);
  }

  setEnvValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/env/valid/set', param);
  }

  updateTag(param: EnvEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/env/update', param);
  }


}
