import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';
import { TagEdit, TagPageQuery, TagVO } from './tag';

export interface EnvVO extends BaseVO, ValidVO {
  id: number;
  envName: string;
  color: string;
  promptColor: string;
  seq: number;
  comment: string;
}

export interface EnvPageQuery extends PageQuery {
  queryName: string;
}

export interface EnvEdit {
  id?: number;
  envName: string;
  color: string;
  promptColor: string;
  seq: number;
  valid: boolean;
  comment: string;
}

export abstract class EnvData {

  abstract queryEnvPage(param: EnvPageQuery): Observable<DataTable<EnvVO>>;

  abstract updateTag(param: EnvEdit): Observable<HttpResult<Boolean>>;

  abstract addEnv(param: EnvEdit): Observable<HttpResult<Boolean>>;

  abstract deleteEnvById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setEnvValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
