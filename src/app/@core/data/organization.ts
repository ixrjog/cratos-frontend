import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface OrganizationVO extends BaseVO, ValidVO {
  id: number;
  name: string;
  code: string;
  type: string;
  comment: string;
}

export interface OrganizationPageQuery extends PageQuery {
  queryName: string;
  code: string;
}

export interface OrganizationEdit {
  id?: number;
  name: string;
  code: string;
  type: string;
  valid: boolean;
  comment: string;
}

export abstract class OrganizationData {
  abstract queryOrganizationPage(param: OrganizationPageQuery): Observable<DataTable<OrganizationVO>>;
  abstract addOrganization(param: OrganizationEdit): Observable<HttpResult<Boolean>>;
  abstract updateOrganization(param: OrganizationEdit): Observable<HttpResult<Boolean>>;
  abstract deleteOrganizationById(param: { id: number }): Observable<HttpResult<Boolean>>;
  abstract setOrganizationValidById(param: { id: number }): Observable<HttpResult<Boolean>>;
}
