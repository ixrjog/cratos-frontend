import { WorkflowModelVO, WorkOrderVO } from './work-order';
import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { UserVO } from './user';
import { Observable } from 'rxjs';
import { EdsInstanceVO } from './ext-datasource';

export interface WorkOrderTicketDetailsVO {
  workOrder: WorkOrderVO;
  ticketNo: string;
  ticket: WorkOrderTicketVO;
  entries: WorkOrderTicketEntryVO<any>[];
  nodes: Map<string, WorkOrderTicketNodeVO>;
  workflow: WorkflowModelVO;
  currentNode: string;
}

export interface WorkOrderTicketVO extends BaseVO, ValidVO {
  id: number;
  ticketNo: string;
  workOrderId: number;
  workOrder: WorkOrderVO;
  username: string;
  nodeId: number;
  ticketState: string;
  ticketResult: string;
  success: boolean;
  submittedAt: Date;
  completed: boolean;
  completedAt: Date;
  autoProcessing: boolean;
  processAt: Date;
  applyRemark: string;
  workflow: string;
  version: string;
  comment: string;
  applicant: UserVO;
  ticketAbstract: {
    entryCnt: number
    markdown: string
  };
  applicantInfo: {
    applicant: boolean
  };
  approvalInfo: {
    currentApprover: boolean
    approvalRequired: boolean
  };
}

export interface WorkOrderTicketEntryVO<T> extends ValidVO {
  id: number;
  ticketId: number;
  name: string;
  displayName: string;
  instanceId: number;
  instance: EdsInstanceVO;
  businessType: string;
  subType: string;
  businessId: number;
  completed: boolean;
  completedAt: Date;
  entryKey: string;
  namespace: string;
  executedAt: Date;
  success: boolean;
  comment: string;
  content: string;
  detail: T;
  result: string;
}

export interface WorkOrderTicketNodeVO {
  id: number;
  ticketId: number;
  approvalType: string;
  nodeName: string;
  username: string;
  parentId: number;
  approvalStatus: string;
  approvalAt: Date;
  approvalCompleted: boolean;
  comment: string;
  approveRemark: string;
  applicantInfo: {
    isApplicant: boolean
  };
  approvalInfo: {
    isCurrentApprover: boolean
    approvalRequired: boolean
  };
}

export interface SubmitTicket {
  ticketNo: string;
  applyRemark: string;
  nodeApprovers: { nodeName: string, username: string }[];
}

export interface ApprovalTicket {
  ticketNo: string;
  approveRemark: string;
  approvalType: string;
}

export interface MyTicketPageQuery extends PageQuery {
  ticketNo: string;
  ticketState: string;
  workOrderKey: string;
  username: string;
  mySubmitted: boolean;
}

export interface TicketPageQuery extends PageQuery {
  ticketNo: string;
  ticketState: string;
  workOrderKey: string;
  username: string;
}

export abstract class WorkOrderTicketData {

  abstract createTicket(param: { workOrderKey: string }): Observable<HttpResult<WorkOrderTicketDetailsVO>>;

  abstract getTicket(param: { ticketNo: string }): Observable<HttpResult<WorkOrderTicketDetailsVO>>;

  abstract submitTicket(param: SubmitTicket): Observable<HttpResult<WorkOrderTicketDetailsVO>>;

  abstract approvalTicket(param: ApprovalTicket): Observable<HttpResult<WorkOrderTicketDetailsVO>>;

  abstract queryMyTicketPage(param: MyTicketPageQuery): Observable<DataTable<WorkOrderTicketVO>>;

  abstract queryTicketPage(param: TicketPageQuery): Observable<DataTable<WorkOrderTicketVO>>;

  abstract deleteTicketById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract doNextStateOfTicket(param: { ticketNo: string }): Observable<HttpResult<WorkOrderTicketDetailsVO>>;

  abstract adminDeleteTicketById(param: { id: number }): Observable<HttpResult<Boolean>>;


}
