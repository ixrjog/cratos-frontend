import { BaseVO, DataTable, HttpResult, OptionsVO, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';

export interface ApplicationVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  config: string;
  comment: string;
  resources: Map<string, ApplicationResourceVO>;
}

export interface ApplicationResourceVO {
  id: number;
  applicationName: string;
  instanceName: string;
  name: string;
  displayName: string;
  resourceType: string;
  businessId: number;
  businessType: string;
  comment: string;
}

export interface ApplicationPageQuery extends PageQuery {
  queryName: string;
}

export interface ApplicationEdit {
  id?: number;
  name: string;
  valid: boolean;
  config: string;
  comment: string;
}

export interface ScanResource {
  name: string;
}

export abstract class ApplicationData {

  abstract queryApplicationPage(param: ApplicationPageQuery): Observable<DataTable<ApplicationVO>>;

  abstract updateApplication(param: ApplicationEdit): Observable<HttpResult<Boolean>>;

  abstract addApplication(param: ApplicationEdit): Observable<HttpResult<Boolean>>;

  abstract deleteApplicationById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setApplicationValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract scanApplicationResource(param: ScanResource): Observable<HttpResult<Boolean>>;

  abstract scanAllApplicationResource(): Observable<HttpResult<Boolean>>;

  abstract deleteApplicationResourceById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract getResourceNamespaceOptions(): Observable<HttpResult<OptionsVO>>;

}
