import { EdsAssetVO, EdsInstanceVO } from './ext-datasource';
import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { UserVO } from './user';

export interface EdsCloudIdentityDetailsVO {
  username: string;
  cloudIdentities: Map<string, Map<number, EdsAssetVO[]>>;
  instanceMap: Map<number, EdsInstanceVO[]>;
  policyMap: Map<string, string[]>;
}

export interface EdsLdapIdentityDetailsVO {
  username: string;
  ldapIdentities: Map<number, EdsAssetVO[]>;
  instanceMap: Map<number, EdsInstanceVO[]>;
  ldapGroupMap: Map<number, string[]>;
}

export interface EdsDingtalkIdentityDetailsVO {
  username: string;
  dingtalkIdentities: Map<number, EdsAssetVO[]>;
  instanceMap: Map<number, EdsInstanceVO[]>;
}

export interface EdsGitLabIdentityDetailsVO {
  username: string;
  gitLabIdentities: Map<number, EdsAssetVO[]>;
  instanceMap: Map<number, EdsInstanceVO[]>;
  sshKeyMap: Map<number, EdsAssetVO[]>;
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

export abstract class EdsIdentityData {
  abstract queryCloudIdentityDetails(param: { username: string }): Observable<HttpResult<EdsCloudIdentityDetailsVO>>;

  abstract queryLdapIdentityDetails(param: { username: string }): Observable<HttpResult<EdsLdapIdentityDetailsVO>>;

  abstract queryDingtalkIdentityDetails(param: {
    username: string
  }): Observable<HttpResult<EdsDingtalkIdentityDetailsVO>>;

  abstract queryGitLabIdentityDetails(param: { username: string }): Observable<HttpResult<EdsGitLabIdentityDetailsVO>>;

  abstract createLdapIdentity(param: CreateLdapIdentity): Observable<HttpResult<LdapIdentity>>;

  abstract deleteLdapIdentity(param: DeleteLdapIdentity): Observable<HttpResult<Boolean>>;

  abstract resetLdapUserPassword(param: ResetLdapUserPassword): Observable<HttpResult<LdapIdentity>>;

  abstract addLdapUserToTheGroup(param: AddLdapUserToTheGroup): Observable<HttpResult<Boolean>>;

  abstract removeLdapUserFromGroup(param: RemoveLdapUserFromGroup): Observable<HttpResult<Boolean>>;

  abstract queryLdapGroups(param: { instanceId: number }): Observable<HttpResult<Array<string>>>;

}
