import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface RobotVO extends BaseVO, ValidVO {
  id: number;
  name: string;
  username: string;
  token: string;
  createdBy: string;
  expiredTime: Date;
  comment: string;
}

export interface RobotEdit {
  name: string;
  username?: string;
  valid: boolean;
  comment: string;
  expiredTime: any;
}


export interface RobotTokenVO {
  name: string;
  username: string
  token: string
  expiredTime: Date;
}


export interface RobotPageQuery extends PageQuery{
  queryName: string;
}

export abstract class RobotData {

  abstract queryRobotPage(param: RobotPageQuery): Observable<DataTable<RobotVO>>;

  abstract queryRobotByUsername(param: { username: string }): Observable<HttpResult<Array<RobotVO>>>;

  abstract addRobot(param: RobotEdit): Observable<HttpResult<RobotTokenVO>>;

  abstract applyRobot(param: RobotEdit): Observable<HttpResult<RobotTokenVO>>;

  abstract revokeRobot(param: { id: number }): Observable<HttpResult<Boolean>>;

}
