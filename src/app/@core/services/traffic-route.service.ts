import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  SwitchRecordTarget,
  TrafficRecordTargetEdit,
  TrafficRouteData,
  TrafficRouteEdit,
  TrafficRoutePageQuery,
  TrafficRouteVO,
} from '../data/traffic-route';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { EdsInstanceVO } from '../data/ext-datasource';

@Injectable()
export class TrafficRouteService extends TrafficRouteData {

  baseUrl = '/traffic/route';

  constructor(private apiService: ApiService) {
    super();
  }

  queryDnsResolverInstances(): Observable<HttpResult<Array<EdsInstanceVO>>> {
    return this.apiService.get(this.baseUrl, '/dns/resolver/instance/query', {});
  }

  queryTrafficRoutePage(param: TrafficRoutePageQuery): Observable<DataTable<TrafficRouteVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addTrafficRecordTarget(param: TrafficRecordTargetEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/record/target/add', param);
  }

  getTrafficRouteById(param: { id: number }): Observable<HttpResult<TrafficRouteVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  deleteTrafficRouteById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setTrafficRecordTargetValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/record/target/valid/set', param);
  }

  addTrafficRoute(param: TrafficRouteEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateTrafficRoute(param: TrafficRouteEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  getTrafficRecordTargetTypeOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/record/target/type/options/get', {});
  }

  setTrafficRouteValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  deleteTrafficRecordTargetById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/record/target/del', param);
  }

  updateTrafficRecordTarget(param: TrafficRecordTargetEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/record/target/update', param);
  }

  switchToTarget(param: SwitchRecordTarget): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/record/target/switch', param);
  }

  switchToDcTarget(param: { routeId: number; dcRole: string }): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/dc/target/switch', param);
  }

  getDcRoleOptions(): Observable<HttpResult<Array<string>>> {
    return new Observable(observer => {
      this.apiService.post('/tag', '/page/query', { tagKey: 'DCRole', page: 1, length: 1 })
        .subscribe((tagRes: any) => {
          const tags = tagRes?.body?.data;
          if (tags && tags.length > 0) {
            const tagId = tags[0].id;
            this.apiService.post('/business/tag', '/query/by/value', {
              tagId: tagId,
              businessType: 'TRAFFIC_RECORD_TARGET',
            }).subscribe((res: any) => {
              observer.next(res);
              observer.complete();
            });
          } else {
            observer.next({ body: [] } as any);
            observer.complete();
          }
        });
    });
  }

}
