import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface ChannelLineVO extends BaseVO, ValidVO {
  id: number;
  channelId: number;
  name: string;
  lineType: string;
  sourceEndpoint: string;
  monitorUrl: string;
  linkedChannel: boolean;
  comment: string;
  channelName: string;
}

export interface ChannelLinePageQuery extends PageQuery {
  queryName: string;
  channelId?: number;
}

export interface ChannelLineEdit {
  id?: number;
  channelId: number;
  name: string;
  lineType: string;
  sourceEndpoint: string;
  monitorUrl: string;
  linkedChannel: boolean;
  valid: boolean;
  comment: string;
}
