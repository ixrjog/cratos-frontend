import { BaseVO, CommitParam, DataTable, HttpResult, PageQuery, ResourceCountVO, ValidVO } from './base-data';
import { BusinessTagsVO } from './business-tag';
import { EdsAssetIndexVO, EdsAssetVO } from './ext-datasource';
import { Observable } from 'rxjs';
import { BusinessDocsVO } from './business-doc';
import { EnvVO } from './env';

export interface TrafficLayerDomainVO extends BaseVO, ValidVO, ResourceCountVO, BusinessTagsVO, BusinessDocsVO {
  id: number;
  name: string;
  domain: string;
  registeredDomain: string;
  dnsProviders: {
    providerType: string;
    providerName: string;
    consoleUrl: string;
  }[];
  comment: string;
  recordEnvs: TrafficLayerDomainEnvVO[];
  records?: any[]; // 添加可选的records属性
}

export interface TrafficLayerRecordVO extends BaseVO, ValidVO, BusinessTagsVO, BusinessDocsVO {
  id: number;
  domainId: number;
  envName: string;
  recordName: string;
  routeTrafficTo: string;
  originServer: string;
  comment: string;
  domain: TrafficLayerDomainVO;
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
  hasRouteTrafficTo: boolean;
}

export interface TrafficLayerRecordQueryDetails {
  domainId: number;
  envName: string;
}

/** Response of /cloudflare/workers/callback/rules. `rules` is a raw JSON string. */
export interface TrafficLayerCloudFlareWorkersCallbackRules {
  rules: string;
  /** CloudFlare 控制台(dashboard) 地址，用于快捷跳转。 */
  dashUrl?: string;
}

/** Parsed shape of a single CloudFlare Worker callback rule. */
export interface CloudFlareWorkersCallbackRule {
  name: string;
  paths: string[];
  whitelist: string[];
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
  loadBalancerUrl: EdsAssetIndexVO;
  trafficLimitQps: EdsAssetIndexVO;
  sourceIp: EdsAssetIndexVO;
}

export interface UpdateTrafficLayerIngressTrafficLimit {
  assetId: number;
  limitQps: number;
  commit: CommitParam;
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

  abstract queryCloudFlareWorkersCallbackRules(param: { callbackDomain: string }): Observable<HttpResult<TrafficLayerCloudFlareWorkersCallbackRules>>;

  abstract queryIngressHostDetails(param: { queryHost: string }): Observable<HttpResult<TrafficLayerIngressVO>>;

  abstract queryIngressDetails(param: { name: string }): Observable<HttpResult<TrafficLayerIngressVO>>;

  abstract queryIngressTrafficLimitPage(param: TrafficLayerIngressTrafficLimitPageQuery): Observable<DataTable<TrafficLayerIngressTrafficLimitVO>>;

  abstract updateIngressTrafficLimit(param: UpdateTrafficLayerIngressTrafficLimit): Observable<HttpResult<Boolean>>;

  abstract queryIngressServiceDetails(param: { queryService: string }): Observable<HttpResult<TrafficLayerIngressVO>>;

}

export interface TrafficLayerTopologyVO {
  serviceName: string;
  trafficPaths: TrafficPathVO[];
}

export interface TrafficPathVO {
  routeMap?: { [domain: string]: TopologyRouteVO };
  loadBalancer: TopologyLoadBalancerVO;
}

export interface TopologyLoadBalancerVO {
  dnsName: string;
  loadBalancerName?: string;
  /** When present, the LB detail (listeners/rules) can be queried on demand. */
  assetId?: number;
}

export interface TopologyRouteVO {
  record: string;
  cdn: string;
  proxied: boolean;
  host: string;
  namespace: string;
  originServer: string;
  rules: string[];
}

/** Mirrors ProjectLoadBalancerVO.LoadBalancer on the backend. */
export interface ProjectLoadBalancerDetailVO {
  instanceName?: string;
  loadBalancerType?: string;
  loadBalancerName?: string;
  loadBalancerId?: string;
  dnsName?: string;
  regionId?: string;
  listeners?: ProjectLbListenerVO[];
  lbConfig?: { routes?: any[] };
}

export interface ProjectLbListenerVO {
  listenerProtocol?: string;
  listenerPort?: number;
  startPort?: string;
  endPort?: string;
  listenerDescription?: string;
  serverGroupId?: string;
  listenerStatus?: string;
  serverGroupServers?: ProjectLbServerVO[];
  forwardTo?: number;
  aclList?: ProjectLbAclVO[];
  ruleList?: ProjectLbRuleVO[];
}

export interface ProjectLbServerVO {
  serverId?: string;
  serverType?: string;
  serverIp?: string;
  port?: number;
  weight?: number;
  serverGroupId?: string;
  zoneId?: string;
}

export interface ProjectLbAclVO {
  name?: string;
  aclId?: string;
  aclType?: string;
  aclEntries?: { description?: string; entry?: string; status?: string }[];
}

export interface ProjectLbRuleVO {
  ruleName?: string;
  ruleStatus?: string;
  ruleConditions?: ProjectLbRuleConditionVO[];
  ruleActions?: ProjectLbRuleActionVO[];
}

export interface ProjectLbRuleConditionVO {
  type?: string;
  hostConfig?: { values?: string[] };
  pathConfig?: { values?: string[] };
  sourceIpConfig?: { values?: string[] };
}

export interface ProjectLbRuleActionVO {
  forwardGroupConfig?: { serverGroupTuples?: { serverGroupId?: string; weight?: number }[] };
}
