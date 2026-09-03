import { Observable } from 'rxjs';
import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';

export interface UserScriptVO extends BaseVO, ValidVO {
  id: number;
  name: string;
  function: string;
  osType: string;
  scriptContent: string;
  username: string;
  comment: string;
}

export interface UserScriptPageQuery extends PageQuery {
  queryName: string;
  function: string;
  osType: string;
  valid: boolean;
}

export interface UserScriptEdit {
  id?: number;
  name: string;
  function: string;
  osType: string;
  scriptContent: string;
  valid: boolean;
  comment: string;
}

export abstract class UserScriptData {

  abstract queryUserScriptPage(param: UserScriptPageQuery): Observable<DataTable<UserScriptVO>>;

  abstract getUserScriptById(param: { id: number }): Observable<HttpResult<UserScriptVO>>;

  abstract addUserScript(param: UserScriptEdit): Observable<HttpResult<Boolean>>;

  abstract updateUserScript(param: UserScriptEdit): Observable<HttpResult<Boolean>>;

  abstract deleteUserScriptById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setUserScriptValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
