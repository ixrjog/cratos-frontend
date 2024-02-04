import { TagVO } from './tag';
import { Observable } from 'rxjs';
import { HttpResult } from './base-data';

export interface BusinessTagVO {
  id: number;
  businessType: string;
  businessId: number;
  tagId: number;
  tagValue: string;
  tag: TagVO;
}

export interface GetByBusiness {
  businessType: string,
  businessId: number,
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


export enum BusinessTypeEnum {
  BUSINESS_DOC = 'BUSINESS_DOC',
  // 证书
  CERTIFICATE = 'CERTIFICATE',
  TAG = 'TAG',
  BUSINESS_TAG = 'BUSINESS_TAG',
  // 凭据
  CREDENTIAL = 'CREDENTIAL',
  BUSINESS_CREDENTIAL = 'BUSINESS_CREDENTIAL',
  USER = 'USER',

  // RBAC
  RBAC_ROLE = 'RBAC_ROLE',
  RBAC_GROUP = 'RBAC_GROUP',
  RBAC_RESOURCE = 'RBAC_RESOURCE',
  RBAC_USER_ROLE = 'RBAC_USER_ROLE',
}
