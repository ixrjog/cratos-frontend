import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import {
  ApplicationData,
  ApplicationEdit,
  ApplicationPageQuery,
  ApplicationVO,
  ScanResource,
} from '../data/application';

@Injectable()
export class ApplicationService extends ApplicationData {

  baseUrl = '/application';

  constructor(private apiService: ApiService) {
    super();
  }

  addApplication(param: ApplicationEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteApplicationById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryApplicationPage(param: ApplicationPageQuery): Observable<DataTable<ApplicationVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setApplicationValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateApplication(param: ApplicationEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  scanApplicationResource(param: ScanResource): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/scan', param);
  }

  scanAllApplicationResource(): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/all/scan', {});
  }

  deleteApplicationResourceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/resource/del', param);
  }

  getResourceNamespaceOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/resource/namespace/options/get', {});
  }

  getMyResourceNamespaceOptions(param: { applicationName: string }): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/resource/namespace/my/options/get', param);
  }

}
