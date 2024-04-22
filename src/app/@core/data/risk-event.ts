import { BaseVO, DataTable, HttpResult, OptionsVO, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO, BusinessDocVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';

export interface RiskEventVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  eventTime: Date;
  states: string;
  year: string;
  quarter: string;
  weeks: string;
  comment: string;
  impacts: RiskEventImpactVO[];
  totalCost: {
    cost: number
    costDesc: string
  };
}

export interface RiskEventImpactVO extends BaseVO, ValidVO, BusinessTagsVO {
  id: number;
  riskEventId: number;
  content: string;
  startTime: Date;
  endTime: Date;
  sla: boolean;
  cost: number;
  comment: string;
}

export interface RiskEventPageQuery extends PageQuery {
  // queryName: string;
  // states: string;
  // year: string;
  // quarter: string;
  // weeks: string;
  // valid: boolean;
}

export interface RiskEventEdit {
  id?: number;
  name: string;
  eventTime: any;
  states?: string;
  valid: boolean;
  comment: string;
}

export interface RiskEventImpactEdit {
  id?: number;
  riskEventId: number;
  content: string;
  startTime: any;
  endTime: any;
  sla: boolean;
  valid: boolean;
  comment: string;
}

export abstract class RiskEventData {

  abstract queryRiskEventPage(param: RiskEventPageQuery): Observable<DataTable<RiskEventVO>>;

  abstract addRiskEvent(param: RiskEventEdit): Observable<HttpResult<Boolean>>;

  abstract updateRiskEvent(param: RiskEventEdit): Observable<HttpResult<Boolean>>;

  abstract setRiskEventValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteRiskEventById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract addRiskEventImpact(param: RiskEventImpactEdit): Observable<HttpResult<Boolean>>;

  abstract updateRiskEventImpact(param: RiskEventImpactEdit): Observable<HttpResult<Boolean>>;

  abstract setRiskEventImpactValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteRiskEventImpactById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract getRiskEventById(param: { id: number }): Observable<HttpResult<RiskEventVO>>;

  abstract getYearOptions(): Observable<HttpResult<OptionsVO>>;


}
