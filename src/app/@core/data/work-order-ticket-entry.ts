import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { UserBusinessPermission } from './user-permission';
import { UserVO } from './user';
import { EdsAssetVO } from './ext-datasource';


export interface AddApplicationPermissionTicketEntry {
  ticketId: number;
  detail: UserBusinessPermission;
}

export interface AddComputerPermissionTicketEntry {
  ticketId: number;
  detail: UserBusinessPermission;
}

export interface AddRevokeUserPermissionTicketEntry {
  ticketId: number;
  detail: UserVO;
}

export interface AddGitLabPermissionTicketEntry {
  ticketId: number;
  detail: GitLabPermission;
}

export interface GitLabPermission {
  target: EdsAssetVO
  role: string
}



export abstract class WorkOrderTicketEntryData {

  abstract addApplicationPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addComputerPermissionTicketEntry(param: AddComputerPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addRevokeUserPermissionTicketEntry(param: AddRevokeUserPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract setTicketEntryValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteTicketEntryById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract addGitLabProjectPermissionTicketEntry(param: AddGitLabPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addGitLabGroupPermissionTicketEntry(param: AddGitLabPermissionTicketEntry): Observable<HttpResult<Boolean>>;

}
