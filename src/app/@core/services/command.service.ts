import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AddCommandExec,
  ApproveCommandExec,
  CommandData,
  CommandExecPageQuery,
  CommandExecVO,
  DoCommandExec,
} from '../data/command';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { EdsInstanceVO } from '../data/ext-datasource';
import { UserVO } from '../data/user';

@Injectable()
export class CommandService extends CommandData {

  baseUrl = '/command/exec';

  constructor(private apiService: ApiService) {
    super();
  }

  addCommandExec(param: AddCommandExec): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  approveCommandExec(param: ApproveCommandExec): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/approve', param);
  }

  deleteCommandById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryCommandExecPage(param: CommandExecPageQuery): Observable<DataTable<CommandExecVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  doCommandExec(param: DoCommandExec): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/do', param);
  }

  adminDoCommandExec(param: DoCommandExec): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/admin/do', param);
  }

  queryCommandExecEdsInstancePage(param: { queryName: string }): Observable<DataTable<EdsInstanceVO>> {
    return this.apiService.post(this.baseUrl, '/instance/page/query', param);
  }

  queryCommandExecUserPage(param: { queryName: string }): Observable<DataTable<UserVO>> {
    return this.apiService.post(this.baseUrl, '/user/page/query', param);
  }

  queryCommandExecEdsInstanceNamespace(param: { instanceId: number }): Observable<HttpResult<Array<string>>> {
    return this.apiService.post(this.baseUrl, '/instance/namespace/query', param);
  }

}
