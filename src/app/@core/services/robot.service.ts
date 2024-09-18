import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RobotData, RobotEdit, RobotPageQuery, RobotTokenVO, RobotVO } from '../data/robot';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class RobotService extends RobotData {

  baseUrl = '/robot';

  constructor(private apiService: ApiService) {
    super();
  }

  addRobot(param: RobotEdit): Observable<HttpResult<RobotTokenVO>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  applyRobot(param: RobotEdit): Observable<HttpResult<RobotTokenVO>> {
    return this.apiService.post(this.baseUrl, '/apply', param);
  }

  queryRobotByUsername(param: { username: string }): Observable<HttpResult<Array<RobotVO>>> {
    return this.apiService.get(this.baseUrl, '/username/query', param);
  }

  queryRobotPage(param: RobotPageQuery): Observable<DataTable<RobotVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  revokeRobot(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/revoke', param);
  }

}
