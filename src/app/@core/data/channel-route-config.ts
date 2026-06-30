import { Observable } from 'rxjs';
import { DataTable, HttpResult } from './base-data';

/**
 * A single route line entry. Multiple entries may share the same lineTag,
 * one per business (actionType) that the line serves.
 */
export interface ChannelRouteLineVO {
  id: number;
  lineTag: string;
  randomStart: number;
  randomEnd: number;
  weight: number;
  enable: boolean;
  actionType: string;
}

/**
 * Channel route config returned by GET /channel/route/config/get.
 */
export interface ChannelRouteConfigVO {
  id: number;
  channelId: number;
  country: string;
  applicationId: number;
  instanceId: number;
  service: string;
  saveApi: string;
  queryApi: string;
  namespace: string;
  valid: boolean;
  comment: string;
  instanceName: string;
  channel: any;
  lines: ChannelRouteLineVO[];
}

export abstract class ChannelRouteConfigData {
  abstract getRouteConfig(param: { channelId: number }): Observable<HttpResult<ChannelRouteConfigVO>>;

  abstract queryChannelRouteConfigPage(param: ChannelRouteConfigPageQuery): Observable<DataTable<ChannelRouteConfigVO>>;

  abstract addChannelRouteConfig(param: ChannelRouteConfigEdit): Observable<HttpResult<boolean>>;

  abstract updateChannelRouteConfig(param: ChannelRouteConfigEdit): Observable<HttpResult<boolean>>;

  abstract callSaveConfig(param: ChannelRouteCallSaveParam): Observable<HttpResult<boolean>>;

  abstract queryChannelRouteConfigLine(param: { routeConfigId: number }): Observable<HttpResult<ChannelRouteLineVO[]>>;

  abstract addLine(param: ChannelRouteAddLine): Observable<HttpResult<boolean>>;
}

export interface ChannelRouteAddLine {
  routeConfigId: number;
  lineTag: string;
  actionType?: string;
  weight?: number;
  valid?: boolean;
  whiteListAccounts?: string;
  suffixNumber?: string;
  comment?: string;
}

export interface ChannelRouteConfigPageQuery {
  queryName?: string;
  country?: string;
  page: number;
  length: number;
}

export interface ChannelRouteConfigEdit {
  id?: number;
  channelId: number;
  country: string;
  routeChannel: string;
  applicationId?: number;
  instanceId?: number;
  service: string;
  saveApi: string;
  queryApi: string;
  namespace: string;
  valid: boolean;
  comment: string;
}

/** A single line config entry sent to the backend on save. */
export interface ChannelRouteConfigLine {
  lineTag: string;
  randomStart: number;
  randomEnd: number;
  enable: boolean;
  actionTypeEnum: string;
  suffixNumber: string[];
  whiteListAccounts: string[];
}

export interface ChannelRouteSaveConfig {
  id?: number;
  operator?: string;
  configCode?: string;
  description?: string;
  route?: { countryCode: string; channel: string };
  configValue: ChannelRouteConfigLine[];
}

export interface ChannelRouteCallSaveParam {
  channelRouteConfigId: number;
  saveConfig: ChannelRouteSaveConfig;
}
