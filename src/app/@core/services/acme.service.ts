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
  page: number;
  length: number;
}

export interface AcmeOrderPageQuery {
  acmeDomainId: number;
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

  addAcmeDomain(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/domain/add', param);
  }

  updateAcmeDomain(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/domain/update', param);
  }

  queryAcmeOrderPage(param: AcmeOrderPageQuery): Observable<DataTable<AcmeOrderVO>> {
    return this.apiService.post(this.baseUrl, '/order/page/query', param);
  }

  queryAcmeAccountPage(param: { queryName: string, page: number, length: number }): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/account/page/query', param);
  }

  getAcmeCertificate(param: { id: number }): Observable<HttpResult<any>> {
    return this.apiService.get(this.baseUrl, '/certificate/get', param);
  }

}
