import { Observable } from 'rxjs';
import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';

export interface SecurityIncidentTimelineVO extends BaseVO {
  id: number;
  incidentId: number;
  eventTime: string;
  username: string;
  action: string;
  content: string;
  attachment?: string;
}

export interface SecurityIncidentVO extends BaseVO, ValidVO {
  id: number;
  incidentNo: string;
  title: string;
  incidentType?: string;
  severity?: string;
  status?: string;
  source?: string;
  background?: string;
  impactScope?: string;
  handlingProcess?: string;
  rootCause?: string;
  handlingResult?: string;
  postmortemNote?: string;
  dataInvolved?: boolean;
  reportRequired?: boolean;
  reported?: boolean;
  reportTime?: string;
  occurTime?: string;
  discoverTime?: string;
  respondTime?: string;
  containTime?: string;
  recoverTime?: string;
  closeTime?: string;
  durationMinutes?: number;
  followUpGroup?: string;
  creator?: string;
  comment?: string;
  /** 安全负责人(多人) */
  owners?: string[];
  /** 处理人(多人) */
  handlers?: string[];
  /** 处置时间线, 仅详情接口返回 */
  timeline?: SecurityIncidentTimelineVO[];
}

export interface SecurityIncidentPageQuery extends PageQuery {
  queryName?: string;
  incidentType?: string;
  severity?: string;
  status?: string;
  dataInvolved?: boolean;
  /** 只看我参与的事件 */
  onlyMine?: boolean;
}

/** 新增/编辑事件的提交体; id 为空即新增 */
export interface SecurityIncidentEdit {
  id?: number;
  title: string;
  incidentType?: string;
  severity?: string;
  status?: string;
  source?: string;
  background?: string;
  impactScope?: string;
  handlingProcess?: string;
  rootCause?: string;
  handlingResult?: string;
  postmortemNote?: string;
  dataInvolved?: boolean;
  reportRequired?: boolean;
  reported?: boolean;
  reportTime?: string;
  occurTime?: string;
  discoverTime?: string;
  respondTime?: string;
  containTime?: string;
  recoverTime?: string;
  closeTime?: string;
  followUpGroup?: string;
  comment?: string;
  owners?: string[];
  handlers?: string[];
}

export interface SecurityIncidentTimelineEdit {
  id?: number;
  incidentId: number;
  eventTime: string;
  username?: string;
  action?: string;
  content: string;
  attachment?: string;
}

export abstract class SecurityIncidentData {
  abstract queryIncidentPage(param: SecurityIncidentPageQuery): Observable<DataTable<SecurityIncidentVO>>;

  abstract getIncidentById(param: { id: number }): Observable<HttpResult<SecurityIncidentVO>>;

  abstract addIncident(param: SecurityIncidentEdit): Observable<HttpResult<Boolean>>;

  abstract updateIncident(param: SecurityIncidentEdit): Observable<HttpResult<Boolean>>;

  abstract deleteIncidentById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setIncidentValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract saveIncidentTimeline(param: SecurityIncidentTimelineEdit): Observable<HttpResult<Boolean>>;

  abstract deleteIncidentTimelineById(param: { id: number }): Observable<HttpResult<Boolean>>;
}
