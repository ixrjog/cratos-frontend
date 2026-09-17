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
  /** 命令执行(回车提交)时间, 输入侧采集才有; 历史数据为 null */
  inputAt?: string;
  /** 采集到的输出行数 */
  outputLines?: number;
  /** 输出是否被截断(超过 3 行或 512 字符) */
  outputTruncated?: boolean;
  /** 命令耗时(毫秒, 近似) */
  durationMs?: number;
  /** 采集方式: AUDIT_PARSE / INPUT_TRACK */
  source?: string;
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
  topic: string;
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
  SSH_SERVER = 'SSH_SERVER',
  WEB_SHELL = 'WEB_SHELL',
  WEB_KUBERNETES_SHELL = 'WEB_KUBERNETES_SHELL'
}

export enum SshShellEventType {
  SESSION_STARTED = 'SESSION_STARTED',
  SESSION_STOPPED = 'SESSION_STOPPED',
  SESSION_STOPPED_UNEXPECTEDLY = 'SESSION_STOPPED_UNEXPECTEDLY',
  SESSION_DESTROYED = 'SESSION_DESTROYED'
}
