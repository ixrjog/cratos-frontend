import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import {
  CopyTemplate,
  CreateResourceByTemplate,
  KubernetesResourceData, KubernetesResourceMemberEdit, KubernetesResourceMemberPageQuery, KubernetesResourcePageQuery,
  KubernetesResourceTemplateEdit, KubernetesResourceTemplateMemberVO,
  KubernetesResourceTemplatePageQuery,
  KubernetesResourceTemplateVO, KubernetesResourceVO, LockTemplate,
} from '../data/kubernetes-resource';

@Injectable()
export class KubernetesResourceService extends KubernetesResourceData {

  baseUrl = '/kubernetes/resource';

  constructor(private apiService: ApiService) {
    super();
  }

  addTemplate(param: KubernetesResourceTemplateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/template/add', param);
  }

  deleteTemplateById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/template/del', param);
  }

  getResourceKindOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/kind/options/get', {});
  }

  queryTemplatePage(param: KubernetesResourceTemplatePageQuery): Observable<DataTable<KubernetesResourceTemplateVO>> {
    return this.apiService.post(this.baseUrl, '/template/page/query', param);
  }

  setTemplateValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/template/valid/set', param);
  }

  updateTemplate(param: KubernetesResourceTemplateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/template/update', param);
  }

  copyTemplate(param: CopyTemplate): Observable<HttpResult<KubernetesResourceTemplateVO>> {
    return this.apiService.post(this.baseUrl, '/template/copy', param);
  }

  createResourceByTemplate(param: CreateResourceByTemplate): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/template/create', param);
  }

  getTemplateById(param: { id: number }): Observable<HttpResult<KubernetesResourceTemplateVO>> {
    return this.apiService.get(this.baseUrl, '/template/get', param);
  }

  addMember(param: KubernetesResourceMemberEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/member/add', param);
  }

  deleteMemberById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/member/del', param);
  }

  queryMemberPage(param: KubernetesResourceMemberPageQuery): Observable<DataTable<KubernetesResourceTemplateMemberVO>> {
    return this.apiService.post(this.baseUrl, '/member/page/query', param);
  }

  setMemberValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/member/valid/set', param);
  }

  updateMember(param: KubernetesResourceMemberEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/member/update', param);
  }

  deleteResourceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryResourcePage(param: KubernetesResourcePageQuery): Observable<DataTable<KubernetesResourceVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  lockTemplate(param: LockTemplate): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/template/lock', param);
  }

}
