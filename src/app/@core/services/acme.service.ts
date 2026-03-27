import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable } from '../data/base-data';

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
  createTime: string;
  updateTime: string;
}

export interface AcmeDomainPageQuery {
  queryName: string;
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

}
