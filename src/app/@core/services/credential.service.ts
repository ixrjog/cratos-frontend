import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, OptionsVO } from '../data/base-data';
import { CredentialAdd, CredentialData, CredentialPageQuery, CredentialUpdate, CredentialVO } from '../data/credential';

@Injectable()
export class CredentialService extends CredentialData {

  baseUrl = '/credential';

  constructor(private apiService: ApiService) {
    super();
  }

  queryCredentialPage(param: CredentialPageQuery): Observable<DataTable<CredentialVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  getCredentialOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/options/get', {});
  }

  setCredentialValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  addCredential(param: CredentialAdd): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteCredentialById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  updateCredential(param: CredentialUpdate): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
