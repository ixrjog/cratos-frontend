import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  ApplicationCredentialData,
  ApplicationCredentialPageQuery,
  ApplicationCredentialVO,
} from '../data/application-credential';
import { Observable } from 'rxjs';
import { DataTable } from '../data/base-data';

@Injectable()
export class ApplicationCredentialService extends ApplicationCredentialData {

  baseUrl = '/application/credential';

  constructor(private apiService: ApiService) {
    super();
  }

  queryCredentialPage(param: ApplicationCredentialPageQuery): Observable<DataTable<ApplicationCredentialVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

}
