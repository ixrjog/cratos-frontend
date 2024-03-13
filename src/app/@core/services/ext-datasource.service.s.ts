import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AssetPageQuery,
  AssetToBusiness,
  EdsAssetVO,
  EdsConfigEdit,
  EdsConfigPageQuery,
  EdsConfigVO,
  EdsData,
  EdsInstanceVO,
  ImportInstanceAsset,
  InstanceEdit,
  InstancePageQuery,
  RegisterInstance,
} from '../data/ext-datasource';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';

@Injectable()
export class EdsService extends EdsData {

  constructor(private apiService: ApiService) {
    super();
  }

  getEdsInstanceTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get('/eds/instance/type/options/get', {});
  }

  addEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/eds/config/add', param);
  }

  deleteEdsConfigById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/eds/config/del', param);
  }

  deleteEdsInstanceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/eds/instance/del', param);
  }

  deleteEdsInstanceAssetById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/eds/instance/asset/del', param);
  }

  getEdsConfigById(param: { configId: number }): Observable<HttpResult<EdsConfigVO>> {
    return this.apiService.get('/eds/config/get', param);
  }

  importEdsInstanceAsset(param: ImportInstanceAsset): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/eds/instance/asset/import', param);
  }

  queryEdsConfigPage(param: EdsConfigPageQuery): Observable<DataTable<EdsConfigVO>> {
    return this.apiService.post('/eds/config/page/query', param);
  }

  queryEdsInstancePage(param: InstancePageQuery): Observable<DataTable<EdsInstanceVO>> {
    return this.apiService.post('/eds/instance/page/query', param);
  }

  getEdsInstanceById(param: { instanceId: number }): Observable<HttpResult<EdsInstanceVO>> {
    return this.apiService.get('/eds/instance/get', param);
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

  setEdsInstanceValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/eds/instance/valid/set', param);
  }

  setEdsInstanceAssetValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/eds/instance/asset/valid/set', param);
  }

  queryEdsInstanceAssetPage(param: AssetPageQuery): Observable<DataTable<EdsAssetVO>> {
    return this.apiService.post('/eds/instance/asset/query', param);
  }

  getToBusinessTarget(param: { assetId: number }): Observable<HttpResult<AssetToBusiness>> {
    return this.apiService.get('/eds/asset/to/business/target/get', param);
  }

}
