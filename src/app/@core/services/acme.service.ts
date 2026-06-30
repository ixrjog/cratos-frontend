import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

export interface AcmeDomainVO {
  id: number;
  name: string;
  domainId: number;
  domain: string;
  domains: string;
  zoneId: string;
  dnsResolverInstanceId: number;
  accountId: number;
  valid: boolean;
  dcvType: string;
  dcvDelegationTarget: string;
  comment: string;
  account: any;
  recentOrder: any;
  businessTags: any[];
  businessDocs: any[];
  createTime: Date;
  updateTime: Date;
}

export interface AcmeOrderVO {
  id: number;
  accountId: number;
  domainId: number;
  certificateId: number;
  orderUrl: string;
  orderStatus: string;
  expires: string;
  dnsChallengeRecords: string;
  domains: string;
  errorMessage: string;
  account: any;
  acmeDomain: any;
  businessTags: any[];
  businessDocs: any[];
  createTime: Date;
  updateTime: Date;
}

export interface AcmeDomainPageQuery {
  queryName: string;
  domain?: string;
  page: number;
  length: number;
}

export interface AcmeDomainGroupVO {
  domain: string;
  count: number;
}

export interface AcmeOrderPageQuery {
  acmeDomainId?: number;
  domain?: string;
  domains?: string;
  page: number;
  length: number;
}

@Injectable()
export class AcmeService {

  baseUrl = '/acme';

  constructor(private apiService: ApiService) {
  }

  queryAcmeDomainPage(param: AcmeDomainPageQuery): Observable<DataTable<AcmeDomainVO>> {
    return this.apiService.post(this.baseUrl, '/domain/page/query', param);
  }

  queryDistinctAcmeDomain(): Observable<HttpResult<AcmeDomainGroupVO[]>> {
    return this.apiService.get(this.baseUrl, '/domain/distinct/query', {});
  }

  queryHasDcvAcmeDomain(param: { dcvType?: string; page: number; length: number }): Observable<HttpResult<AcmeDomainVO[]>> {
    return this.apiService.post(this.baseUrl, '/domain/dcv/query', param);
  }

  addAcmeDomain(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/domain/add', param);
  }

  updateAcmeDomain(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/domain/update', param);
  }

  issueCertificate(param: { acmeDomainId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/certificate/issue', param);
  }

  queryAcmeOrderPage(param: AcmeOrderPageQuery): Observable<DataTable<AcmeOrderVO>> {
    return this.apiService.post(this.baseUrl, '/order/page/query', param);
  }

  queryDistinctOrderDomains(domain?: string): Observable<HttpResult<string[]>> {
    return this.apiService.get(this.baseUrl, '/order/domains/distinct/query', domain ? { domain } : {});
  }

  queryAcmeAccountPage(param: { queryName: string, page: number, length: number }): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/account/page/query', param);
  }

  getAcmeCertificate(param: { id: number }): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/certificate/get', param);
  }

  deleteAcmeOrderById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/order/del', param);
  }

  recoverDcvDelegation(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/domain/dcv/relegation/recover', param);
  }

}
