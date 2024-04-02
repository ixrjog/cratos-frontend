import { BaseVO, DataTable, HttpResult, OptionsVO, PageQuery, ResourceCountVO, ValidVO } from './base-data';
import { Observable } from 'rxjs';
import { CredentialVO } from './credential';
import { BusinessTagsVO } from './business-tag';

export interface EdsInstanceVO extends BaseVO, ValidVO, BusinessTagsVO {
  id: number;
  instanceName: string;
  edsType: string;
  kind: string;
  version: string;
  configId: number;
  url: string;
  comment: string;
  registered: boolean;
  edsConfig: EdsConfigVO;
  assetTypes: string[];
}

export interface EdsConfigVO extends BaseVO, ValidVO {
  id: number;
  name: string;
  edsType: string;
  version: string;
  credentialId: number;
  instanceId: number;
  url: string;
  configContent: string;
  comment: string;
  credential: CredentialVO;
}

export interface EdsAssetVO extends BaseVO, ValidVO, ResourceCountVO {
  id: number;
  parentId: number;
  instanceId: number;
  name: string;
  assetId: string;
  assetKey: string;
  assetType: string;
  kind: string;
  version: string;
  region: string;
  zone: string;
  assetStatus: string;
  createdTime: Date;
  expiredTime: Date;
  description: string;
  originalModel: string;
  originalAsset: any;
  toBusiness: ToBusiness;
}

export interface InstancePageQuery extends PageQuery {
  queryName: string;
  edsType: string;
}

export interface EdsConfigPageQuery extends PageQuery {
  queryName: string;
  edsType: string;
  valid: boolean;
}

export interface AssetPageQuery extends PageQuery {
  instanceId: number;
  queryName: string;
  assetType: string;
  valid: boolean;
}

export interface InstanceEdit {
  id?: number;
  name: string;
  edsType: string;
  version: string;
  valid: boolean;
  credentialId: number;
  instanceId: number;
  url: string;
  configContent: string;
  comment: string;
}

export interface EdsConfigEdit {
  id?: number;
  name: string;
  edsType: string;
  version: string;
  valid: boolean;
  credentialId: number;
  instanceId?: number;
  url: string;
  configContent: string;
  comment: string;
}

export interface RegisterInstance {
  instanceName: string;
  kind: string;
  version: string;
  valid: boolean;
  configId: number;
  url: string;
  comment: string;
}

export interface ImportInstanceAsset {
  instanceId: number;
  assetType: string;
}

export interface ToBusiness {
  businessType: string;
  businessId: number;
  assetId: number;
  bind: boolean;
}

export interface AssetToBusiness {
  toBusiness: ToBusiness;
  target: any;
}

export interface DeleteInstanceAsset {
  instanceId: number;
  assetType: string;
}

export interface EdsAssetIndexVO extends BaseVO {
  id: number;
  instanceId: number;
  assetId: number;
  name: string;
  value: string;
  comment: string;
}

export abstract class EdsData {

  abstract getEdsInstanceTypeOptions(): Observable<HttpResult<OptionsVO>>;

  abstract queryEdsInstancePage(param: InstancePageQuery): Observable<DataTable<EdsInstanceVO>>;

  abstract getEdsInstanceById(param: { instanceId: number }): Observable<HttpResult<EdsInstanceVO>>;

  abstract registerEdsInstance(param: RegisterInstance): Observable<HttpResult<Boolean>>;

  abstract updateEdsInstance(param: InstanceEdit): Observable<HttpResult<Boolean>>;

  abstract queryEdsConfigPage(param: EdsConfigPageQuery): Observable<DataTable<EdsConfigVO>>;

  abstract getEdsConfigById(param: { configId: number }): Observable<HttpResult<EdsConfigVO>>;

  abstract addEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>>;

  abstract updateEdsConfig(param: EdsConfigEdit): Observable<HttpResult<Boolean>>;

  abstract deleteEdsInstanceById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteEdsConfigById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteEdsInstanceAssetById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract importEdsInstanceAsset(param: ImportInstanceAsset): Observable<HttpResult<Boolean>>;

  abstract setEdsConfigValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setEdsInstanceValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setEdsInstanceAssetValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryEdsInstanceAssetPage(param: AssetPageQuery): Observable<DataTable<EdsAssetVO>>;

  abstract queryAssetIndexByAssetId(param: { assetId: number }): Observable<HttpResult<Array<EdsAssetIndexVO>>>;

  abstract getToBusinessTarget(param: { assetId: number }): Observable<HttpResult<AssetToBusiness>>

  abstract deleteEdsInstanceAsset(param: DeleteInstanceAsset): Observable<HttpResult<Boolean>>;

}

export enum EdsAssetTypeEnum {
  ALIYUN_CERT = 'ALIYUN_CERT',
  AWS_CERT = 'AWS_CERT',
  AWS_STS_VPN = 'AWS_STS_VPN',
  CLOUDFLARE_CERT = 'CLOUDFLARE_CERT',
  KUBERNETES_DEPLOYMENT = 'KUBERNETES_DEPLOYMENT',
  KUBERNETES_INGRESS= 'KUBERNETES_INGRESS',
  LDAP_PERSON = 'LDAP_PERSON',
  LDAP_GROUP = 'LDAP_GROUP',
  GITLAB_PROJECT = 'GITLAB_PROJECT',
  GITLAB_GROUP = 'GITLAB_GROUP',
  GITLAB_USER = 'GITLAB_USER',
  GITLAB_SSHKEY = 'GITLAB_SSHKEY',
}

