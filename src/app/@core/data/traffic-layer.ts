import { BaseVO, DataTable, HttpResult, PageQuery, ResourceCountVO, ValidVO } from './base-data';
import { BusinessTagsVO } from './business-tag';
import { EdsAssetIndexVO, EdsAssetVO } from './ext-datasource';
import { Observable } from 'rxjs';
import { BusinessDocsVO } from './business-doc';
import { EnvVO } from './env';

export interface TrafficLayerDomainVO extends BaseVO, ValidVO, ResourceCountVO, BusinessTagsVO, BusinessDocsVO {
  id: number;
  name: string;
  domain: string;
  comment: string;
}

export interface TrafficLayerRecordVO extends BaseVO, ValidVO, BusinessTagsVO, BusinessDocsVO {
  id: number;
  domainId: number;
  envName: string;
  recordName: string;
  routeTrafficTo: string;
  originServer: string;
  comment: string;
  env: EnvVO;
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

export interface TrafficLayerIngressVO {
  ingressTable: string;
  names: string[];
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
  domainId: number;
}

export interface TrafficLayerRecordQueryDetails {
  domainId: number;
  envName: string;
}

export interface TrafficLayerDomainEnvVO {
  envName: string;
  valid: boolean;
  seq: number;
}

export interface TrafficLayerIngressTrafficLimitVO extends BaseVO{
  asset: EdsAssetVO;
  rules: EdsAssetIndexVO[];
  namespace: EdsAssetIndexVO;
  loadBalancer: EdsAssetIndexVO;
  trafficLimitQps: EdsAssetIndexVO;
  sourceIp: EdsAssetIndexVO;
}

export interface UpdateTrafficLayerIngressTrafficLimit {
  assetId: number;
  limitQps: number;
}

export interface TrafficLayerIngressTrafficLimitPageQuery extends PageQuery {
  queryName: string;
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

  abstract queryTrafficLayerDomainEnv(param: { domainId: number }): Observable<HttpResult<Array<TrafficLayerDomainEnvVO>>>;

  abstract queryIngressHostDetails(param: { queryHost: string }): Observable<HttpResult<TrafficLayerIngressVO>>;

  abstract queryIngressDetails(param: { name: string }): Observable<HttpResult<TrafficLayerIngressVO>>;

  abstract queryIngressTrafficLimitPage(param: TrafficLayerIngressTrafficLimitPageQuery): Observable<DataTable<TrafficLayerIngressTrafficLimitVO>>;

  abstract updateIngressTrafficLimit(param: UpdateTrafficLayerIngressTrafficLimit): Observable<HttpResult<Boolean>>;
}
