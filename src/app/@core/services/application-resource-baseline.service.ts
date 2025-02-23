import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  ApplicationResourceBaselineData,
  ApplicationResourceBaselinePageQuery,
  ApplicationResourceBaselineVO,
} from '../data/application-resource-baseline';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';

@Injectable()
export class ApplicationResourceBaselineService extends ApplicationResourceBaselineData {

  baseUrl = '/application/resource/baseline';

  constructor(private apiService: ApiService) {
    super();
  }

  queryApplicationResourceBaselinePage(param: ApplicationResourceBaselinePageQuery): Observable<DataTable<ApplicationResourceBaselineVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  scanAllBaseline(): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/scanAll', {});
  }

  getBaselineTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/type/options', {});
  }

  rescanBaselineById(param: { baselineId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/rescan', param);
  }

  mergeToBaseline(param: { baselineId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/merge', param);
  }

  redeployBaselineDeployment(param: { baselineId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/redeploy', param);
  }

}
