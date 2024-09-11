import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';
import { BusinessDocsVO } from './business-doc';

export interface GlobalNetworkVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  mainName: string;
  cidrBlock: string;
  resourceTotal: number;
  comment: string;
  plannings: GlobalNetworkPlanningVO[];
}

export interface GlobalNetworkPlanningVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  networkId: number;
  name: string;
  cidrBlock: string;
  resourceTotal: number;
  comment: string;
  network: GlobalNetworkVO;
}

export interface GlobalNetworkSubnetVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  mainName: string;
  mainType: string;
  mainId: number;
  subnetKey: string;
  region: string;
  zone: string;
  cidrBlock: string;
  resourceTotal: number;
  comment: string;
}

export interface GlobalNetworkPageQuery extends PageQuery {
  queryName: string;
}

export interface GlobalNetworkPlanningPageQuery extends PageQuery {
  queryName: string;
  networkId: number;
}

export interface GlobalNetworkSubnetPageQuery extends PageQuery {
  queryName: string;
}

export interface GlobalNetworkEdit {
  id?: number;
  name: string;
  mainName: string;
  cidrBlock: string;
  resourceTotal: number;
  valid: boolean;
  comment: string;
}

export interface GlobalNetworkPlanningEdit {
  id?: number;
  networkId: number;
  name: string;
  cidrBlock: string;
  resourceTotal: number;
  valid: boolean;
  comment: string;
}

export interface GlobalNetworkSubnetEdit {
  id?: number;
  name: string;
  mainName: string;
  mainType: string;
  mainId: number;
  subnetKey: string;
  region: string;
  zone: string;
  cidrBlock: string;
  resourceTotal: number;
  valid: boolean;
  comment: string;
  fromAssetId?: number;
}

export interface NetworkDetails {
  networkId: number;
  network: GlobalNetworkVO;
  planningDetails: PlanningDetails[];
}

export interface PlanningDetails extends ValidVO {
  id: number;
  networkId: number;
  name: string;
  cidrBlock: string;
  resourceTotal: number;
  comment: string;
  subnetTable: string;
}

export abstract class GlobalNetworkData {

  abstract queryGlobalNetworkPage(param: GlobalNetworkPageQuery): Observable<DataTable<GlobalNetworkVO>>;

  abstract addGlobalNetwork(param: GlobalNetworkEdit): Observable<HttpResult<Boolean>>;

  abstract updateGlobalNetwork(param: GlobalNetworkEdit): Observable<HttpResult<Boolean>>;

  abstract setGlobalNetworkValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteGlobalNetworkById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryGlobalNetworkPlanningPage(param: GlobalNetworkPlanningPageQuery): Observable<DataTable<GlobalNetworkPlanningVO>>;

  abstract addGlobalNetworkPlanning(param: GlobalNetworkPlanningEdit): Observable<HttpResult<Boolean>>;

  abstract updateGlobalNetworkPlanning(param: GlobalNetworkPlanningEdit): Observable<HttpResult<Boolean>>;

  abstract setGlobalNetworkPlanningValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteGlobalNetworkPlanningById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryGlobalNetworkSubnetPage(param: GlobalNetworkSubnetPageQuery): Observable<DataTable<GlobalNetworkSubnetVO>>;

  abstract updateGlobalNetworkSubnet(param: GlobalNetworkSubnetEdit): Observable<HttpResult<Boolean>>;

  abstract addGlobalNetworkSubnet(param: GlobalNetworkSubnetEdit): Observable<HttpResult<Boolean>>;

  abstract deleteGlobalNetworkSubnetById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setGlobalNetworkSubnetValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryGlobalNetworkDetails(param: { id: number }): Observable<HttpResult<NetworkDetails>>;

}
