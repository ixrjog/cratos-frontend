import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface ChannelBusinessVO extends BaseVO, ValidVO {
  id: number;
  organizationId: number;
  channelId: number;
  businessName: string;
  type: string;
  businessDirection: string;
  comment: string;
  organizationName: string;
  channelName: string;
  organization: { id: number; name: string };
  channel: { id: number; name: string };
}

export interface ChannelBusinessPageQuery extends PageQuery {
  queryName: string;
  channelId?: number;
  organizationId?: number;
}

export interface ChannelBusinessEdit {
  id?: number;
  organizationId: number;
  channelId: number;
  businessName: string;
  type: string;
  businessDirection: string;
  valid: boolean;
  comment: string;
}

export enum BusinessDirectionEnum {
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND',
}
