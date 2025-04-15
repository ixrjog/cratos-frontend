import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { UserBusinessPermission } from './user-permission';
import { UserVO } from './user';


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

export abstract class WorkOrderTicketEntryData {

  abstract addApplicationPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addComputerPermissionTicketEntry(param: AddComputerPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addRevokeUserPermissionTicketEntry(param: AddRevokeUserPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract setTicketEntryValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteTicketEntryById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
