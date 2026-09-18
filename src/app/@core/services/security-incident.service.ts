import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DataTable, HttpResult } from '../data/base-data';
import {
  SecurityIncidentData,
  SecurityIncidentEdit,
  SecurityIncidentPageQuery,
  SecurityIncidentTimelineEdit,
  SecurityIncidentVO,
} from '../data/security-incident';

@Injectable({ providedIn: 'root' })
export class SecurityIncidentService extends SecurityIncidentData {

  baseUrl = '/security/incident';

  constructor(private apiService: ApiService) {
    super();
  }

  queryIncidentPage(param: SecurityIncidentPageQuery): Observable<DataTable<SecurityIncidentVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  getIncidentById(param: { id: number }): Observable<HttpResult<SecurityIncidentVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  addIncident(param: SecurityIncidentEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateIncident(param: SecurityIncidentEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteIncidentById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setIncidentValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  saveIncidentTimeline(param: SecurityIncidentTimelineEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/timeline/save', param);
  }

  deleteIncidentTimelineById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/timeline/del', param);
  }

}
