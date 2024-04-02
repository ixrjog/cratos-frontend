import { BaseVO, DataTable, HttpResult, PageQuery, ResourceCountVO, ValidVO } from './base-data';
import { BusinessTagVO } from './business-tag';
import { EdsAssetIndexVO, EdsAssetVO } from './ext-datasource';
import { Observable } from 'rxjs';
import { BusinessDocVO } from './business-doc';

export interface TrafficLayerDomainVO extends BaseVO, ValidVO, ResourceCountVO, BusinessTagVO, BusinessDocVO {
  id: number;
  name: string;
  domain: string;
  comment: string;
}

export interface TrafficLayerRecordVO extends BaseVO, ValidVO, BusinessTagVO, BusinessDocVO {
  id: number;
  domainId: number;
  envName: string;
  recordName: string;
  routeTrafficTo: string;
  originServer: string;
  comment: string;
}

export interface TrafficLayerRecordOriginServerVO {
  origins: EdsAssetVO[];
  details: Map<string, EdsAssetIndexVO[]>;
}

export interface TrafficLayerRecordDetails {
  recordId: number;
  record: TrafficLayerRecordVO;
  originServer: TrafficLayerRecordOriginServerVO;
  tableDetails: {
    recordTable: string
    lbTable: string
    ingressRuleTable: string
  };
}

export interface TrafficLayerDomainEdit {
  id?: number;
  name: string;
  domain: string;
  valid: boolean;
  comment: string;
}

export interface TrafficLayerRecordEdit {
  id?: number;
  domainId: number;
  envName: string;
  recordName: string;
  routeTrafficTo: string;
  originServer: string;
  valid: boolean;
  comment: string;
}

export interface TrafficLayerDomainPageQuery extends PageQuery {
  queryName: string;
}

export interface TrafficLayerRecordPageQuery extends PageQuery {
  queryName: string;
}

export interface TrafficLayerRecordQueryDetails {
  domainId: number;
  envName: string;
}

export abstract class TrafficLayerData {

  abstract queryTrafficLayerDomainPage(param: TrafficLayerDomainPageQuery): Observable<DataTable<TrafficLayerDomainVO>>;

  abstract queryTrafficLayerRecordPage(param: TrafficLayerRecordPageQuery): Observable<DataTable<TrafficLayerRecordVO>>;

  abstract addTrafficLayerDomain(param: TrafficLayerDomainEdit): Observable<HttpResult<Boolean>>;

  abstract updateTrafficLayerDomain(param: TrafficLayerDomainEdit): Observable<HttpResult<Boolean>>;

  abstract setTrafficLayerDomainValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteTrafficLayerDomain(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract addTrafficLayerRecord(param: TrafficLayerRecordEdit): Observable<HttpResult<Boolean>>;

  abstract updateTrafficLayerRecord(param: TrafficLayerRecordEdit): Observable<HttpResult<Boolean>>;

  abstract setTrafficLayerRecordValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteTrafficLayerRecord(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryRecordDetails(param: TrafficLayerRecordQueryDetails): Observable<HttpResult<TrafficLayerRecordDetails>>;
}
