import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';

export interface DomainVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  registrationTime: Date;
  expiry: Date;
  domainType: string;
  comment: string;
}

export interface DomainPageQuery extends PageQuery {
  queryName: string;
}

export interface DomainEdit {
  id?: number;
  name: string;
  valid: boolean;
  registrationTime: any;
  expiry: any;
  domainType: string;
  comment: string;
  fromAssetId?: number;
}

export abstract class DomainData {
  
  abstract queryDomainPage(param: DomainPageQuery): Observable<DataTable<DomainVO>>;

  abstract updateDomain(param: DomainEdit): Observable<HttpResult<Boolean>>;

  abstract addDomain(param: DomainEdit): Observable<HttpResult<Boolean>>;

  abstract deleteDomainById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setDomainValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
