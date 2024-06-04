import { BaseVO, DataTable, PageQuery, ResourceCountVO } from './base-data';
import { Observable } from 'rxjs';

export interface SshSessionVO extends BaseVO {
  id: number;
  sessionId: string;
  username: string;
  remoteAddr: string;
  sessionStatus: string;
  serverHostname: string;
  serverAddr: string;
  sessionType: string;
  startTime: Date;
  endTime: Date;
  sessionInstances: SshInstanceVO[];
}

export interface SshInstanceVO extends BaseVO, ResourceCountVO {
  id: number;
  sessionId: string;
  instanceId: string;
  duplicateInstanceId: string;
  instanceType: string;
  loginUser: string;
  destIp: string;
  outputSize: number;
  instanceClosed: boolean;
  auditPath: string;
  startTime: Date;
  endTime: Date;
}

export interface SshCommandVO extends BaseVO {
  id: number;
  sshSessionInstanceId: number;
  prompt: string;
  isFormatted: boolean;
  input: string;
  inputFormatted: string;
  output: string;
}

export interface SshSessionPageQuery extends PageQuery {
  username: string;
  sessionStatus: string;
  sessionType: string;
}

export interface SshCommandPageQuery extends PageQuery {
  sshSessionInstanceId: number;
  inputFormatted: string;
}

export interface SshAuditPlayMessage {
  state: string;
  sessionId: string;
  instanceId: string;
}

export interface OutputMessage {
  instanceId: string;
  output: string;
  error: string;
  code: number;
}

export abstract class SshSessionData {

  abstract querySshSessionPage(param: SshSessionPageQuery): Observable<DataTable<SshSessionVO>>;

  abstract querySshCommandPage(param: SshCommandPageQuery): Observable<DataTable<SshCommandVO>>;

}

export enum SshSessionTypeEnum {
  SSH_SERVER = 'SSH_SERVER'
}

export enum SshShellEventType {
  SESSION_STARTED = 'SESSION_STARTED',
  SESSION_STOPPED = 'SESSION_STOPPED',
  SESSION_STOPPED_UNEXPECTEDLY = 'SESSION_STOPPED_UNEXPECTEDLY',
  SESSION_DESTROYED = 'SESSION_DESTROYED'
}
