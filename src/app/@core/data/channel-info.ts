import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface ChannelInfoVO extends BaseVO, ValidVO {
  id: number;
  name: string;
  monitorUrl: string;
  priority: string;
  country: string;
  networkInfo: string;
  availableStatus: string;
  constructionPhase: string;
  comment: string;
  members: { [key: string]: ChannelMemberVO[] };
}

export interface ChannelMemberVO {
  id: number;
  channelId: number;
  businessType: string;
  businessId: number;
  role: string;
  name: string;
  valid: boolean;
  comment: string;
}

export interface ChannelInfoPageQuery extends PageQuery {
  queryName: string;
}

export interface ChannelInfoEdit {
  id?: number;
  name: string;
  monitorUrl: string;
  priority: string;
  country: string;
  networkInfo: string;
  availableStatus: string;
  constructionPhase: string;
  valid: boolean;
  comment: string;
}

export abstract class ChannelInfoData {
  abstract queryChannelPage(param: ChannelInfoPageQuery): Observable<DataTable<ChannelInfoVO>>;
  abstract addChannel(param: ChannelInfoEdit): Observable<HttpResult<Boolean>>;
  abstract updateChannel(param: ChannelInfoEdit): Observable<HttpResult<Boolean>>;
  abstract deleteChannelById(param: { id: number }): Observable<HttpResult<Boolean>>;
  abstract setChannelValidById(param: { id: number }): Observable<HttpResult<Boolean>>;
}

export enum ChannelAvailableStatusEnum {
  HA = 'HA',
  UNSTABLE = 'UNSTABLE',
  DOWN = 'DOWN',
}

export enum ChannelConstructionPhaseEnum {
  PLANNING = 'PLANNING',
  BUILDING = 'BUILDING',
  TESTING = 'TESTING',
  COMPLETED = 'COMPLETED',
}

export enum ChannelPriorityEnum {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  PENDING = 'PENDING',
}
