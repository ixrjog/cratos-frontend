import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  EdsConfigEdit,
  EdsConfigPageQuery,
  EdsConfigVO,
  EdsData,
  EdsInstanceVO,
  importInstanceAsset,
  InstanceEdit,
  InstancePageQuery,
  RegisterInstance,
} from '../data/ext-datasource';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class EdsService extends EdsData {

  constructor(private apiService: ApiService) {
    super();
  }

  addEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/eds/config/add', param);
  }

  deleteEdsConfigById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/eds/config/del', param);
  }

  getEdsConfigById(param: { configId: number }): Observable<HttpResult<EdsConfigVO>> {
    return this.apiService.get('/eds/config/get', param);
  }

  importEdsInstanceAsset(param: importInstanceAsset): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/eds/instance/asset/import', param);
  }

  queryEdsConfigPage(param: EdsConfigPageQuery): Observable<DataTable<EdsConfigVO>> {
    return this.apiService.post('/eds/config/page/query', param);
  }

  queryEdsInstancePage(param: InstancePageQuery): Observable<DataTable<EdsInstanceVO>> {
    return this.apiService.post('/eds/instance/page/query', param);
  }

  registerEdsInstance(param: RegisterInstance): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/eds/instance/register', param);
  }

  updateEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/eds/config/update', param);
  }

  updateEdsInstance(param: InstanceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/eds/instance/update', param);
  }

  setEdsConfigValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/eds/config/valid/set', param);
  }

}
