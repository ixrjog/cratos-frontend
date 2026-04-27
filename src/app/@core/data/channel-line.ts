import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface ChannelNodeVO extends BaseVO, ValidVO {
  id: number;
  channelId: number;
  name: string;
  nodeType: string;
  sourceEndpoint: string;
  monitorUrl: string;
  linkedChannel: boolean;
  comment: string;
  channelName: string;
}

export interface ChannelNodePageQuery extends PageQuery {
  queryName: string;
  channelId?: number;
}

export interface ChannelNodeEdit {
  id?: number;
  channelId: number;
  name: string;
  nodeType: string;
  sourceEndpoint: string;
  monitorUrl: string;
  linkedChannel: boolean;
  valid: boolean;
  comment: string;
}
