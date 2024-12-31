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

  scanApplicationActuator(): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/scanAll', {});
  }

  getBaselineTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/type/options', {});
  }

}
