import { BaseVO, DataTable, HttpResult, OptionsVO, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';
import { EdsAssetVO, EdsInstanceVO } from './ext-datasource';

export interface KubernetesResourceTemplateVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  templateKey: string;
  apiVersion: string;
  locked: boolean;
  custom: string;
  comment: string;
  members: Map<string, Array<KubernetesResourceTemplateMemberVO>>;
  namespaces: string[];
  kinds: string[];
  instances: KubernetesResourceTemplateInstanceVO[];
}

export interface KubernetesResourceTemplateInstanceVO {
  name: string;
  id: number;
  selected: boolean;
}

export interface KubernetesResourceTemplateMemberVO extends BaseVO, ValidVO {
  id: number;
  templateId: number;
  name: string;
  namespace: string;
  kind: string;
  domainType: string;
  content: string;
  custom: string;
  comment: string;
}

export interface KubernetesResourceTemplatePageQuery extends PageQuery {
  queryName: string;
}

export interface KubernetesResourceMemberPageQuery extends PageQuery {
  templateId: number;
  queryName: string;
  namespace: string;
  kind: string;
}

export interface KubernetesResourceTemplateEdit {
  id?: number;
  name: string;
  templateKey: string;
  apiVersion: string;
  locked: boolean;
  valid: boolean;
  custom: string;
  comment: string;
}

export interface CopyTemplate {
  templateId: number;
  templateName: string;
  templateKey: string;
}

export interface CreateResourceByTemplate {
  templateId: number;
  custom: string;
  namespaces: string[];
  kinds: string[];
  instances: number[];
}

export interface KubernetesResourceMemberEdit {
  id?: number;
  templateId: number;
  namespace: string;
  kind: string;
  valid: boolean;
  content: string;
  custom: string;
  comment: string;
}

export interface KubernetesResourceVO extends BaseVO {
  id: number;
  templateId: number;
  memberId: number;
  name: string;
  namespace: string;
  kind: string;
  edsInstanceId: number;
  assetId: number;
  createdBy: string;
  custom: string;
  comment: string;
  edsInstance: EdsInstanceVO;
  asset: EdsAssetVO;
}

export interface KubernetesResourcePageQuery extends PageQuery {
  queryName: string;
  namespace: string;
  kind: string;
}

export interface LockTemplate {
  templateId: number;
  locked: boolean;
}

export abstract class KubernetesResourceData {

  abstract getResourceKindOptions(): Observable<HttpResult<OptionsVO>>;

  abstract copyTemplate(param: CopyTemplate): Observable<HttpResult<KubernetesResourceTemplateVO>>;

  abstract getTemplateById(param: { id: number }): Observable<HttpResult<KubernetesResourceTemplateVO>>;

  abstract queryTemplatePage(param: KubernetesResourceTemplatePageQuery): Observable<DataTable<KubernetesResourceTemplateVO>>;

  abstract updateTemplate(param: KubernetesResourceTemplateEdit): Observable<HttpResult<Boolean>>;

  abstract addTemplate(param: KubernetesResourceTemplateEdit): Observable<HttpResult<Boolean>>;

  abstract deleteTemplateById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setTemplateValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract createResourceByTemplate(param: CreateResourceByTemplate): Observable<HttpResult<Boolean>>;

  abstract queryMemberPage(param: KubernetesResourceMemberPageQuery): Observable<DataTable<KubernetesResourceTemplateMemberVO>>;

  abstract updateMember(param: KubernetesResourceMemberEdit): Observable<HttpResult<Boolean>>;

  abstract addMember(param: KubernetesResourceMemberEdit): Observable<HttpResult<Boolean>>;

  abstract deleteMemberById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract setMemberValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract queryResourcePage(param: KubernetesResourcePageQuery): Observable<DataTable<KubernetesResourceVO>>;

  abstract deleteResourceById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract lockTemplate(param: LockTemplate): Observable<HttpResult<Boolean>>;

}
