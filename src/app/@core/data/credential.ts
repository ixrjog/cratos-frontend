import { BaseVO, DataTable, HttpResult, OptionsVO, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';
import { BusinessTagsVO } from './business-tag';
import { BusinessDocsVO } from './business-doc';

export interface CredentialVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  title: string;
  credentialType: string;
  username: string;
  fingerprint: string;
  credential: string;
  credential2: string;
  passphrase: string;
  comment: string;
  expiredTime: Date;
  privateCredential: boolean;
}

export interface CredentialPageQuery extends PageQuery {
  queryName: string;
  credentialType?: string;
}

export interface CredentialAdd {
  title: string;
  credentialType: string;
  username: string;
  credential: string;
  credential2?: string;
  fingerprint?: string;
  passphrase?: string;
  valid: boolean;
  comment: string;
  expiredTime: any;
  privateCredential: boolean;
}

export interface CredentialUpdate {
  id: number;
  title?: string;
  username?: string;
  comment?: string;
  valid: boolean;
}

export abstract class CredentialData {

  abstract queryCredentialPage(param: CredentialPageQuery): Observable<DataTable<CredentialVO>>;

  abstract getCredentialOptions(): Observable<HttpResult<OptionsVO>>;

  abstract setCredentialValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract addCredential(param: CredentialAdd): Observable<HttpResult<Boolean>>;

  abstract deleteCredentialById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract updateCredential(param: CredentialUpdate): Observable<HttpResult<Boolean>>;

}

export enum CredentialTypeEnum {
  USERNAME_WITH_PASSWORD = 'USERNAME_WITH_PASSWORD',
  SSH_USERNAME_WITH_PRIVATE_KEY = 'SSH_USERNAME_WITH_PRIVATE_KEY',
  SSH_USERNAME_WITH_KEY_PAIR = 'SSH_USERNAME_WITH_KEY_PAIR',
  TOKEN = 'TOKEN',
  ACCESS_KEY = 'ACCESS_KEY',
  KUBE_CONFIG = 'KUBE_CONFIG',
  SSL_CERTIFICATES = 'SSL_CERTIFICATES',
  OTP = 'OTP',
  DICTIONARY = 'DICTIONARY',
}
