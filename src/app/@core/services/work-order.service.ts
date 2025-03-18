import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WorkOrderData, WorkOrderMenuVO } from '../data/work-order';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';

@Injectable()
export class WorkOrderService extends WorkOrderData {

  baseUrl = '/workorder';

  constructor(private apiService: ApiService) {
    super();
  }

  getWorkOrderMenu(): Observable<HttpResult<WorkOrderMenuVO>> {
    return this.apiService.get(this.baseUrl, '/menu/get', {});
  }

}
