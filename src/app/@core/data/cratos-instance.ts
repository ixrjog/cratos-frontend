import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';

export interface CratosInstanceVO extends BaseVO, ValidVO, BusinessTagsVO {
  id: number;
  name: string;
  hostname: string;
  hostIp: string;
  status: string;
  version: string;
  startTime: Date;
  comment: string;
  commit: string;
  license: string;
}

export interface CratosInstanceHealthVO {
  status: string;
  health: boolean;
}

export interface RegisteredInstancePageQuery extends PageQuery {
  queryName: string;
  valid: boolean;
}

export abstract class CratosInstanceData {

  abstract queryRegisteredInstancePage(param: RegisteredInstancePageQuery): Observable<DataTable<CratosInstanceVO>>;

  abstract setInstanceValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteInstanceById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
