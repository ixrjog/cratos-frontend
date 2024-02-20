import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { CredentialData, CredentialAdd, CredentialPageQuery, CredentialVO, CredentialUpdate } from '../data/credential';

@Injectable()
export class CredentialService extends CredentialData {

  constructor(private apiService: ApiService) {
    super();
  }

  queryCredentialPage(param: CredentialPageQuery): Observable<DataTable<CredentialVO>> {
    return this.apiService.post('/credential/page/query', param);
  }

  getCredentialOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get('/credential/options/get', {});
  }

  setCredentialValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/credential/valid/set', param);
  }

  addCredential(param: CredentialAdd): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/credential/add', param);
  }

  deleteCredentialById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/credential/del', param);  }

  updateCredential(param: CredentialUpdate): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/credential/update', param);
  }

}
