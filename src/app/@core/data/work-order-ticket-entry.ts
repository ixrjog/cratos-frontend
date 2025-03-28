import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { UserBusinessPermission } from './user-permission';


export interface AddApplicationPermissionTicketEntry {
  ticketId: number;
  detail: UserBusinessPermission;
}

export interface AddComputerPermissionTicketEntry {
  ticketId: number;
  detail: UserBusinessPermission;
}

export abstract class WorkOrderTicketEntryData {

  abstract addApplicationPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addComputerPermissionTicketEntry(param: AddComputerPermissionTicketEntry): Observable<HttpResult<Boolean>>;


}
