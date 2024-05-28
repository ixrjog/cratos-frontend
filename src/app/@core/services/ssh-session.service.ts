import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  SshCommandPageQuery,
  SshCommandVO,
  SshSessionData,
  SshSessionPageQuery,
  SshSessionVO,
} from '../data/ssh-session';
import { Observable } from 'rxjs';
import { DataTable } from '../data/base-data';

@Injectable()
export class SshSessionService extends SshSessionData {

  baseUrl = '/ssh/session';

  constructor(private apiService: ApiService) {
    super();
  }

  querySshSessionPage(param: SshSessionPageQuery): Observable<DataTable<SshSessionVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  querySshCommandPage(param: SshCommandPageQuery): Observable<DataTable<SshCommandVO>> {
    return this.apiService.post(this.baseUrl, '/instance/command/page/query', param);
  }

}
