import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  TrafficRecordTargetEdit,
  TrafficRouteData,
  TrafficRouteEdit,
  TrafficRoutePageQuery,
  TrafficRouteVO,
} from '../data/traffic-route';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';

@Injectable()
export class TrafficRouteService extends TrafficRouteData {

  baseUrl = '/traffic/route';

  constructor(private apiService: ApiService) {
    super();
  }

  queryTrafficRoutePage(param: TrafficRoutePageQuery): Observable<DataTable<TrafficRouteVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addTrafficRecordTarget(param: TrafficRecordTargetEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/record/target/add', param);
  }

  addTrafficRoute(param: TrafficRouteEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  getTrafficRecordTargetTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/record/target/type/options/get', {});
  }

  setTrafficRouteValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  deleteTrafficRoute(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

}
