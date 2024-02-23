import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';
import { BusinessDocsVO } from './business-doc';

export interface ChannelNetworkVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  channelKey: string;
  channelStatus: string;
  availableStatus: string;
  comment: string;
}

export interface ChannelNetworkPageQuery extends PageQuery {
  queryName: string;
}

export interface ChannelNetworkEdit {
  id?: number;
  name: string;
  channelKey: string;
  channelStatus: string;
  availableStatus: string;
  valid: boolean;
  comment: string;
}

export abstract class ChannelNetworkData {

  abstract queryChannelNetworkPage(param: ChannelNetworkPageQuery): Observable<DataTable<ChannelNetworkVO>>;

  abstract updateChannelNetwork(param: ChannelNetworkEdit): Observable<HttpResult<Boolean>>;

  abstract addChannelNetwork(param: ChannelNetworkEdit): Observable<HttpResult<Boolean>>;

  abstract deleteChannelNetworkById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setChannelNetworkValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

}

export enum ChannelAvailableStatusEnum {
  HA = 'HA',
  UNSTABLE = 'UNSTABLE',
  DOWN = 'DOWN'
}

export enum ChannelStatusEnum {
  DEBUG = 'DEBUG',
  ONLINE = 'ONLINE'
}
