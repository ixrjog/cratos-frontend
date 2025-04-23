import { EdsAssetVO, EdsInstanceVO } from './ext-datasource';
import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { UserVO } from './user';

export interface EdsCloudIdentityDetailsVO {
  username: string;
  accounts: Map<string, EdsCloudAccountVO[]>;
}

export interface EdsCloudAccountVO {
  username: string;
  password: string;
  instance: EdsInstanceVO;
  user: UserVO;
  account: EdsAssetVO;
  isExist: boolean;
  accountLogin: AccountLoginDetailsVO;
  policies: string[];
  accessKeys: {
    accessKeyId: string
  }[];
  loginProfile: {
    enabled: boolean
  };
}

export interface AccountLoginDetailsVO {
  accountId: string;
  username: string;
  name: string;
  loginUsername: string;
  loginUrl: string;
}

export interface EdsMailIdentityDetailsVO {
  username: string;
  accounts: Map<string, EdsMailAccountVO[]>;
}

export interface EdsMailAccountVO {
  username: string;
  password: string;
  instance: EdsInstanceVO;
  user: UserVO;
  account: EdsAssetVO;
  isExist: boolean;
  accountLogin: AccountLoginDetailsVO;
  mailAlias: string[];
}

export interface EdsLdapIdentityDetailsVO {
  username: string;
  ldapIdentities: EdsLdapAccountVO[];
}

export interface EdsLdapAccountVO {
  username: string;
  password: string;
  instance: EdsInstanceVO;
  user: UserVO;
  account: EdsAssetVO;
  groups: string[];
}

export interface EdsDingtalkIdentityDetailsVO {
  username: string;
  dingtalkIdentities: EdsDingtalkAccountVO[];
}

export interface EdsDingtalkAccountVO {
  username: string;
  instance: EdsInstanceVO;
  user: UserVO;
  account: EdsAssetVO;
  email: string;
  mobile: string;
  avatar: string;
}

export interface EdsGitLabIdentityDetailsVO {
  username: string;
  gitLabIdentities: EdsGitLabAccountVO[];
}

export interface EdsGitLabAccountVO {
  username: string;
  instance: EdsInstanceVO;
  user: UserVO;
  account: EdsAssetVO;
  sshKeys: EdsAssetVO[];
  accountLogin: AccountLoginDetailsVO;
}

export interface CreateLdapIdentity {
  instanceId: number;
  username: string;
  password?: string;
}

export interface DeleteLdapIdentity {
  instanceId: number;
  username: string;
}

export interface ResetLdapUserPassword {
  instanceId: number;
  username: string;
  password?: string;
}

export interface LdapIdentity {
  username: string;
  password: string;
  instance: EdsInstanceVO;
  user: UserVO;
  asset: EdsAssetVO;
}

export interface AddLdapUserToTheGroup {
  instanceId: number;
  username: string;
  group: string;
}

export interface RemoveLdapUserFromGroup {
  instanceId: number;
  username: string;
  group: string;
}

export interface queryIdentityDetails {
  username: string,
  instanceId?: number
}

export abstract class EdsIdentityData {

  abstract queryCloudIdentityDetails(param: {
    username: string,
    instanceType?: string,
    instanceId?: number
  }): Observable<HttpResult<EdsCloudIdentityDetailsVO>>;

  abstract queryLdapIdentityDetails(param: queryIdentityDetails): Observable<HttpResult<EdsLdapIdentityDetailsVO>>;

  abstract queryDingtalkIdentityDetails(param: queryIdentityDetails): Observable<HttpResult<EdsDingtalkIdentityDetailsVO>>;

  abstract queryGitLabIdentityDetails(param: queryIdentityDetails): Observable<HttpResult<EdsGitLabIdentityDetailsVO>>;

  abstract createLdapIdentity(param: CreateLdapIdentity): Observable<HttpResult<LdapIdentity>>;

  abstract deleteLdapIdentity(param: DeleteLdapIdentity): Observable<HttpResult<Boolean>>;

  abstract resetLdapUserPassword(param: ResetLdapUserPassword): Observable<HttpResult<LdapIdentity>>;

  abstract addLdapUserToTheGroup(param: AddLdapUserToTheGroup): Observable<HttpResult<Boolean>>;

  abstract removeLdapUserFromGroup(param: RemoveLdapUserFromGroup): Observable<HttpResult<Boolean>>;

  abstract queryMailIdentityDetails(param: {
    username: string,
    instanceType?: string,
    instanceId?: number
  }): Observable<HttpResult<EdsMailIdentityDetailsVO>>;
}
