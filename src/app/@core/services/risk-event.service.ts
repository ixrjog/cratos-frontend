import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RiskEventData, RiskEventEdit, RiskEventImpactEdit, RiskEventPageQuery, RiskEventVO } from '../data/risk-event';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';

@Injectable()
export class RiskEventService extends RiskEventData {

  baseUrl = '/risk/event';

  constructor(private apiService: ApiService) {
    super();
  }

  addRiskEvent(param: RiskEventEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  addRiskEventImpact(param: RiskEventImpactEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/impact/add', param);
  }

  deleteRiskEventById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  deleteRiskEventImpactById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/impact/del', param);
  }

  queryRiskEventPage(param: RiskEventPageQuery): Observable<DataTable<RiskEventVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setRiskEventImpactValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  setRiskEventValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/impact/valid/set', param);
  }

  updateRiskEvent(param: RiskEventEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  updateRiskEventImpact(param: RiskEventImpactEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/impact/update', param);
  }

  getRiskEventById(param: { id: number }): Observable<HttpResult<RiskEventVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  getYearOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/report/year/options/get', {});
  }

}
