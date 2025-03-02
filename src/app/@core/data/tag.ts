import { Observable } from 'rxjs';
import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';

export interface TagVO extends BaseVO, ValidVO {
  id: number;
  tagType: string;
  tagKey: string;
  tagValue: string;
  color: string;
  promptColor: string;
  seq: number;
  comment: string;
}

export interface TagPageQuery extends PageQuery {
  tagKey: string;
  businessType?: number;
}

export interface TagEdit {
  id?: number;
  tagType: string;
  tagKey: string;
  tagValue?: string;
  color: string;
  promptColor: string;
  seq: number;
  valid: boolean;
  comment: string;
}

export abstract class TagData {

  abstract queryTagPage(param: TagPageQuery): Observable<DataTable<TagVO>>;

  abstract updateTag(param: TagEdit): Observable<HttpResult<Boolean>>;

  abstract addTag(param: TagEdit): Observable<HttpResult<Boolean>>;

  abstract deleteTagById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setTagValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryTagByBusinessType(param: { businessType: string }): Observable<HttpResult<Array<TagVO>>>;

}
