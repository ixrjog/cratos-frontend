import { TagVO } from './tag';
import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { GetByBusiness } from './business';

export interface BusinessTagVO {
  id: number;
  businessType: string;
  businessId: number;
  tagId: number;
  tagValue: string;
  tag: TagVO;
}

export interface BusinessTagEdit {
  id?: number;
  businessType: string;
  businessId: number;
  tagId: number;
  tagValue: string;
}

export interface ListValue {
  tagId: number;
  queryTagValue?: string
}

export abstract class BusinessTagData {

  abstract queryBusinessTagByBusiness(param: GetByBusiness): Observable<HttpResult<Array<BusinessTagVO>>>;

  abstract addBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>>;

  abstract updateBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>>;

  abstract deleteBusinessTagById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryBusinessTagByValue(param: ListValue): Observable<HttpResult<Array<String>>>;

}
