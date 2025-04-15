import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AddApplicationPermissionTicketEntry,
  AddRevokeUserPermissionTicketEntry,
  WorkOrderTicketEntryData,
} from '../data/work-order-ticket-entry';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';

@Injectable()
export class WorkOrderTicketEntryService extends WorkOrderTicketEntryData {

  baseUrl = '/workorder/ticket/entry';

  constructor(private apiService: ApiService) {
    super();
  }

  addApplicationPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/application/permission/add', param);
  }

  addComputerPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/computer/permission/add', param);
  }

  addRevokeUserPermissionTicketEntry(param: AddRevokeUserPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/user/revoke/permission/add', param);
  }

  setTicketEntryValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  deleteTicketEntryById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del/by/id', param);
  }
}
