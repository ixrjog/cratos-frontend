import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DataTable, HttpResult } from '../data/base-data';
import { InfraInfoData, InfraInfoEdit, InfraInfoPageQuery, InfraInfoVO } from '../data/infra-info';

@Injectable()
export class InfraInfoService extends InfraInfoData {

  private baseUrl = '/infra/info';

  constructor(private apiService: ApiService) {
    super();
  }

  queryInfraInfoPage(param: InfraInfoPageQuery): Observable<DataTable<InfraInfoVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  updateInfraInfo(param: InfraInfoEdit): Observable<HttpResult<boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
