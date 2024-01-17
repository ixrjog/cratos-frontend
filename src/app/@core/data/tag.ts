import { Observable } from 'rxjs';
import { BaseVO, DataTable, HttpResult, PageQuery } from './base-data';

export interface TagVo extends BaseVO{
  id: number;
  tagType: number;
  tagKey: string;
  tagValue: string;
  color: string;
  promptColor: number;
  seq: number;
  valid: boolean;
  comment: string;
}

export interface TagPageQuery extends PageQuery {
  tagKey: string;
  businessType?: number;
}

export interface TagEdit {
  id?: number;
  tagType: number;
  tagKey: string;
  tagValue: string;
  color?: string;
  promptColor?: number;
  seq?: number;
  valid: boolean;
  comment?: string;
}

export abstract class TagData {
  abstract queryTagPage(param: TagPageQuery): Observable<DataTable<TagVo>>;

  abstract updateTag(param: TagEdit): Observable<HttpResult<Boolean>>;

  abstract addTag(param: TagEdit): Observable<HttpResult<Boolean>>;
}
