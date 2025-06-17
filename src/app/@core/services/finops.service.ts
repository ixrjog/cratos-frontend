import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FinOpsAppCostVO, FinOpsData, QueryAppCost } from '../data/finops';
import { HttpResult } from '../data/base-data';
import { Observable } from 'rxjs';

@Injectable()
export class FinOpsService extends FinOpsData {

  baseUrl = '/finops';

  constructor(private apiService: ApiService) {
    super();
  }

  queryAppCost(param: QueryAppCost): Observable<HttpResult<FinOpsAppCostVO>> {
    return this.apiService.post(this.baseUrl, '/app/cost/query', param);
  }

}
