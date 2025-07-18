import {
  BaseVO,
  DataTable,
  HttpResult,
  I18nData,
  I18nDataAlias,
  PageQuery,
  ReportBaseData,
  ValidVO,
} from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';
import { UserVO } from './user';

export interface WorkOrderMenuVO {
  groupList: WorkOrderGroupVO[];
}

export interface WorkOrderGroupVO extends BaseVO {
  id: number;
  name: string;
  i18n: string;
  seq: number;
  groupType: string;
  icon: string;
  comment: string;
  i18nData: I18nData;
  workOrderList: WorkOrderVO[];
}

export interface WorkOrderVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  i18n: string;
  seq: number;
  groupId: number;
  workOrderGroup: WorkOrderGroupVO;
  status: string;
  workOrderKey: string;
  color: string;
  docs: string;
  icon: string;
  comment: string;
  i18nData: I18nData;
  workflow: string;
  workflowData: WorkflowModelVO;
  version: string;
  isUsable: boolean
}

export interface WorkflowModelVO {
  nodes: WorkflowNodeVO[];
}

export interface WorkflowNodeVO {
  name: string;
  approvalType: string;
  comment: string;
  langMap: Map<string, I18nDataAlias>;
  selectableUsers: UserVO[];
}

export interface UpdateWorkOrderGroup {
  id: number;
  name: string;
  i18n: string;
  seq: number;
  groupType: string;
  icon: string;
  comment: string;
}

export interface UpdateWorkOrder {
  id: number;
  name: string;
  seq: number;
  workOrderKey: string;
  groupId: number;
  status: string;
  icon: string;
  valid: boolean;
  color: string;
  docs: string;
  workflow: string;
  i18n: string;
  version: string;
}

export interface WorkOrderPageQuery extends PageQuery {
  queryName: string;
  groupId: number;
}

export interface WorkOrderGroupPageQuery extends PageQuery {
  queryName: string;
}

export interface WorkOrderReportMonthlyVO {
  dates: string[];
  nameCat: Map<string, MonthlyStatistics>;
}

export interface MonthlyStatistics {
  values: number[];
  color: string;
}


export abstract class WorkOrderData {

  abstract getWorkOrderMenu(): Observable<HttpResult<WorkOrderMenuVO>>;

  abstract updateWorkOrder(param: UpdateWorkOrder): Observable<HttpResult<Boolean>>;

  abstract updateWorkOrderGroup(param: UpdateWorkOrderGroup): Observable<HttpResult<Boolean>>;

  abstract queryWorkOrderPage(param: WorkOrderPageQuery): Observable<DataTable<WorkOrderVO>>;

  abstract queryWorkOrderGroupPage(param: WorkOrderGroupPageQuery): Observable<DataTable<WorkOrderGroupVO>>;

  abstract getWorkOrderNameReport(): Observable<HttpResult<Array<ReportBaseData>>>;

  abstract getWorkOrderMonthlyReport(): Observable<HttpResult<WorkOrderReportMonthlyVO>>;

}

export enum WorkOrderStatus {
  NEW = 'NEW',
  SUBMITTED = 'SUBMITTED',
  IN_APPROVAL = 'IN_APPROVAL',
  APPROVAL_COMPLETED = 'APPROVAL_COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  PROCESSING_COMPLETED = 'PROCESSING_COMPLETED',
  COMPLETED = 'COMPLETED'
}
