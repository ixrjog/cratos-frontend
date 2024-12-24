import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  ApplicationActuatorData,
  ApplicationActuatorPageQuery,
  ApplicationActuatorVO,
} from '../data/application-actuator';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class ApplicationActuatorService extends ApplicationActuatorData {

  baseUrl = '/application/actuator';

  constructor(private apiService: ApiService) {
    super();
  }

  queryApplicationActuatorPage(param: ApplicationActuatorPageQuery): Observable<DataTable<ApplicationActuatorVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  scanApplicationActuator(): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/scanAll', {});
  }

}
