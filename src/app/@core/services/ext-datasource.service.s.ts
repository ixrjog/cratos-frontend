import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AssetPageQuery,
  AssetToBusiness,
  DeleteInstanceAsset,
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

  baseUrl = '/eds';
  constructor(private apiService: ApiService) {
    super();
  }

  getEdsInstanceTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/instance/type/options/get', {});
  }

  addEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/config/add', param);
  }

  deleteEdsConfigById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/config/del', param);
  }

  deleteEdsInstanceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/instance/del', param);
  }

  deleteEdsInstanceAssetById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/asset/del', param);
  }

  getEdsConfigById(param: { configId: number }): Observable<HttpResult<EdsConfigVO>> {
    return this.apiService.get(this.baseUrl, '/config/get', param);
  }

  importEdsInstanceAsset(param: ImportInstanceAsset): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/instance/asset/import', param);
  }

  queryEdsConfigPage(param: EdsConfigPageQuery): Observable<DataTable<EdsConfigVO>> {
    return this.apiService.post(this.baseUrl, '/config/page/query', param);
  }

  queryEdsInstancePage(param: InstancePageQuery): Observable<DataTable<EdsInstanceVO>> {
    return this.apiService.post(this.baseUrl, '/instance/page/query', param);
  }

  getEdsInstanceById(param: { instanceId: number }): Observable<HttpResult<EdsInstanceVO>> {
    return this.apiService.get(this.baseUrl, '/instance/get', param);
  }

  registerEdsInstance(param: RegisterInstance): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/instance/register', param);
  }

  updateEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/config/update', param);
  }

  updateEdsInstance(param: InstanceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/instance/update', param);
  }

  setEdsConfigValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/config/valid/set', param);
  }

  setEdsInstanceValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/instance/valid/set', param);
  }

  setEdsInstanceAssetValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/instance/asset/valid/set', param);
  }

  queryEdsInstanceAssetPage(param: AssetPageQuery): Observable<DataTable<EdsAssetVO>> {
    return this.apiService.post(this.baseUrl, '/instance/asset/query', param);
  }

  getToBusinessTarget(param: { assetId: number }): Observable<HttpResult<AssetToBusiness>> {
    return this.apiService.get(this.baseUrl, '/asset/to/business/target/get', param);
  }

  deleteEdsInstanceAsset(param: DeleteInstanceAsset): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody(this.baseUrl, '/instance/asset/del', param);
  }


}
