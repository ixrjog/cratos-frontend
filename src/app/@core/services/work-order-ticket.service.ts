import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import {
  ApprovalTicket,
  MyTicketPageQuery,
  SubmitTicket, TicketPageQuery,
  WorkOrderTicketData,
  WorkOrderTicketDetailsVO,
  WorkOrderTicketVO,
} from '../data/work-order-ticket';

@Injectable()
export class WorkOrderTicketService extends WorkOrderTicketData {

  baseUrl = '/workorder/ticket';

  constructor(private apiService: ApiService) {
    super();
  }

  createTicket(param: { workOrderKey: string }): Observable<HttpResult<WorkOrderTicketDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/create', param);
  }

  getTicket(param: { ticketNo: string }): Observable<HttpResult<WorkOrderTicketDetailsVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  submitTicket(param: SubmitTicket): Observable<HttpResult<WorkOrderTicketDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/submit', param);
  }

  approvalTicket(param: ApprovalTicket): Observable<HttpResult<WorkOrderTicketDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/approval', param);
  }

  queryMyTicketPage(param: MyTicketPageQuery): Observable<DataTable<WorkOrderTicketVO>> {
    return this.apiService.post(this.baseUrl, '/my/page/query', param);
  }

  queryTicketPage(param: TicketPageQuery): Observable<DataTable<WorkOrderTicketVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  deleteTicketById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  doNextStateOfTicket(param: { ticketNo: string }): Observable<HttpResult<WorkOrderTicketDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/next', param);
  }
}
