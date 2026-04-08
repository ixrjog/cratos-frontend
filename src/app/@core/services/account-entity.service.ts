import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class AccountEntityService {

  baseUrl = '/account/entity';

  constructor(private apiService: ApiService) {
  }

  queryAccountEntityPage(param: any): Observable<DataTable<any>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addAccountEntity(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateAccountEntity(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
