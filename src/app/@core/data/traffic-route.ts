import {
  BaseVO,
  DataTable,
  DnsResourceRecordSetVO,
  DnsResourceRecordsVO,
  HttpResult,
  OptionsVO,
  PageQuery,
  ResourceCountVO,
  ValidVO,
} from './base-data';
import { BusinessTagsVO } from './business-tag';
import { BusinessDocsVO } from './business-doc';
import { EnvVO } from './env';
import { EdsInstanceVO } from './ext-datasource';
import { Observable } from 'rxjs';

export interface TrafficRouteVO extends BaseVO, ValidVO, ResourceCountVO, BusinessTagsVO, BusinessDocsVO, ResourceCountVO {
  id: number;
  domainId: number;
  domainRecordId: number;
  domain: string;
  domainRecord: string;
  name: string;
  dnsResolverInstanceId: number;
  recordType: string;
  comment: string;
  dnsResourceRecordSet: DnsResourceRecordSetVO;
  envName: string;
  env: EnvVO;
  recordTargets: TrafficRouteRecordTargetVO[];
  dnsResolverInstance: EdsInstanceVO;
}

export interface TrafficRouteRecordTargetVO extends BaseVO, ValidVO, ResourceCountVO, BusinessTagsVO {
  id: number;
  trafficRouteId: number;
  recordType: string;
  resourceRecord: string;
  recordValue: string;
  targetType: string;
  origin: boolean;
  ttl: number;
  weight: number;
  comment: string;
  isActive: boolean;
  dnsResourceRecord: DnsResourceRecordsVO;
}

export interface TrafficRoutePageQuery extends PageQuery {
  queryName: string;
}

export interface TrafficRouteEdit {
  id?: number;
  domainId: number;
  domainRecordId: number;
  domain: string;
  domainRecord: string;
  name: string;
  dnsResolverInstanceId: number;
  recordType: string;
  valid: boolean;
  comment: string;
}

export interface TrafficRecordTargetEdit {
  id?: number;
  domainId: number;
  domainRecordId: number;
  domain: string;
  domainRecord: string;
  name: string;
  dnsResolverInstanceId: number;
  recordType: string;
  valid: boolean;
  comment: string;
}

export abstract class TrafficRouteData {

  abstract queryTrafficRoutePage(param: TrafficRoutePageQuery): Observable<DataTable<TrafficRouteVO>>;

  abstract addTrafficRoute(param: TrafficRouteEdit): Observable<HttpResult<Boolean>>;

  abstract getTrafficRecordTargetTypeOptions(): Observable<HttpResult<OptionsVO>>;

  abstract addTrafficRecordTarget(param: TrafficRecordTargetEdit): Observable<HttpResult<Boolean>>;

  abstract setTrafficRouteValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteTrafficRoute(param: { id: number }): Observable<HttpResult<Boolean>>;

}
