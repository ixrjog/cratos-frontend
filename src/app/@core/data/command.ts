import { BaseVO, DataTable, HttpResult, PageQuery } from './base-data';
import { EnvVO } from './env';
import { Observable } from 'rxjs';
import { EdsInstanceVO } from './ext-datasource';
import { UserVO } from './user';

export interface CommandExecVO extends BaseVO {
  id: number;
  username: string;
  autoExec: boolean;
  approvedBy: string;
  ccTo: string;
  completed: boolean;
  completedAt: Date;
  namespace: string;
  success: boolean;
  applyRemark: string;
  command: string;
  commandMask: string;
  execTargetContent: string;
  outMsg: string;
  errorMsg: string;
  env: EnvVO;
  isMark: boolean;
  applicantInfo: {
    isApplicant: boolean
    execCommand: boolean
  };
  approvalInfo: {
    isCurrentApprover: boolean
    approvalRequired: boolean
  };
  execTarget: {
    instance: {
      name: string
      id: number
      namespace: string
    },
    useDefaultExecContainer: boolean
    maxWaitingTime: number
  };

}

export interface CommandExecPageQuery extends PageQuery {
  namespace: string;
  completed: boolean;
  applyUsername: string;
  approvedBy: string;
  success: boolean;
}


export interface AddCommandExec {
  autoExec: boolean;
  approvedBy: string;
  ccTo: string;
  applyRemark: string;
  command: string;
  execTarget: {
    instanceId: number
    namespace: string
  };
}

export interface ApproveCommandExec {
  commandExecId: number;
  approveRemark: string;
  approvalAction: string;
}

export interface DoCommandExec {
  commandExecId: number;
  maxWaitingTime: number;
}

export abstract class CommandData {

  abstract queryCommandExecPage(param: CommandExecPageQuery): Observable<DataTable<CommandExecVO>>;

  abstract addCommandExec(param: AddCommandExec): Observable<HttpResult<Boolean>>;

  abstract approveCommandExec(param: ApproveCommandExec): Observable<HttpResult<Boolean>>;

  abstract deleteCommandById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract doCommandExec(param: DoCommandExec): Observable<HttpResult<Boolean>>;

  abstract adminDoCommandExec(param: DoCommandExec): Observable<HttpResult<Boolean>>;

  abstract queryCommandExecEdsInstancePage(param: { queryName: string }): Observable<DataTable<EdsInstanceVO>>;

  abstract queryCommandExecEdsInstanceNamespace(param: { instanceId: number }): Observable<HttpResult<Array<string>>>;

  abstract queryCommandExecUserPage(param: { queryName: string }): Observable<DataTable<UserVO>>;
}
