import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';
import { CredentialVO } from './credential';

export interface ServerAccountVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  username: string;
  credentialId: number;
  sudo: boolean;
  protocol: string;
  comment: string;
  credential: CredentialVO;
}

export interface ServerAccountEdit {
  id?: number;
  name: string;
  username: string;
  credentialId: number;
  sudo: boolean;
  protocol: string;
  valid: boolean;
  comment: string;
}

export interface ServerAccountPageQuery extends PageQuery {
  queryName: string;
  valid: boolean;
  protocol: string;
}

export abstract class ServerAccountData {

  abstract queryServerAccountPage(param: ServerAccountPageQuery): Observable<DataTable<ServerAccountVO>>;

  abstract updateServerAccount(param: ServerAccountEdit): Observable<HttpResult<Boolean>>;

  abstract addServerAccount(param: ServerAccountEdit): Observable<HttpResult<Boolean>>;

  abstract deleteServerAccountById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setServerAccountValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

}

export enum RemoteManagementProtocolEnum {
  RDP = 'RDP',
  VNC = 'VNC',
  SSH = 'SSH'
}
