import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CommonData, DnsResolveVO } from '../data/common';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';

@Injectable()
export class CommonService extends CommonData {

  baseUrl = '/common';

  constructor(private apiService: ApiService) {
    super();
  }

  resolveDns(param: { name: string }): Observable<HttpResult<DnsResolveVO>> {
    return this.apiService.get(this.baseUrl, '/util/dns/google/resolve', param);
  }

}
