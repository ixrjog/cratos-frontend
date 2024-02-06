import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { CredentialData, CredentialEdit, CredentialPageQuery, CredentialVO } from '../data/credential';

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

  addCredential(param: CredentialEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/credential/add', param);
  }

  deleteCredentialById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/credential/del', param);  }

}
