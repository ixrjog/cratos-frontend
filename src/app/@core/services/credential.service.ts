import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable } from '../data/base-data';
import { CredentialData, CredentialPageQuery, CredentialVo } from '../data/credential';

@Injectable()
export class CredentialService extends CredentialData {

  constructor(private apiService: ApiService) {
    super();
  }

  queryCredentialPage(param: CredentialPageQuery): Observable<DataTable<CredentialVo>> {
    return this.apiService.post('/credential/page/query', param);
  }

}
