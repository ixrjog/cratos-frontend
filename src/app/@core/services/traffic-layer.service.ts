import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  TrafficLayerData,
  TrafficLayerDomainEdit,
  TrafficLayerDomainEnvVO,
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordDetails,
  TrafficLayerRecordEdit,
  TrafficLayerRecordPageQuery,
  TrafficLayerRecordQueryDetails,
  TrafficLayerRecordVO,
} from '../data/traffic-layer';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class TrafficLayerService extends TrafficLayerData {

  baseUrl = '/traffic/layer';

  constructor(private apiService: ApiService) {
    super();
  }

  addTrafficLayerDomain(param: TrafficLayerDomainEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/domain/add', param);
  }

  addTrafficLayerRecord(param: TrafficLayerRecordEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/record/add', param);
  }

  queryRecordDetails(param: TrafficLayerRecordQueryDetails): Observable<HttpResult<TrafficLayerRecordDetails>> {
    return this.apiService.post(this.baseUrl, '/record/details/query', param);
  }

  queryTrafficLayerDomainPage(param: TrafficLayerDomainPageQuery): Observable<DataTable<TrafficLayerDomainVO>> {
    return this.apiService.post(this.baseUrl, '/domain/page/query', param);
  }

  updateTrafficLayerDomain(param: TrafficLayerDomainEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/domain/update', param);
  }

  updateTrafficLayerRecord(param: TrafficLayerRecordEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/record/update', param);
  }

  deleteTrafficLayerDomain(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/domain/del', param);
  }

  deleteTrafficLayerRecord(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/record/del', param);
  }

  setTrafficLayerRecordValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/record/valid/set', param);
  }

  setTrafficLayerDomainValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/domain/valid/set', param);
  }

  queryTrafficLayerRecordPage(param: TrafficLayerRecordPageQuery): Observable<DataTable<TrafficLayerRecordVO>> {
    return this.apiService.post(this.baseUrl, '/record/page/query', param);
  }

  queryTrafficLayerDomainEnv(param: { domainId: number }): Observable<HttpResult<Array<TrafficLayerDomainEnvVO>>> {
    return this.apiService.post(this.baseUrl, '/domain/env/query', param);
  }
}
