import { HttpResult, I18nData, I18nDataAlias, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';
import { UserVO } from './user';

export interface WorkOrderMenuVO {
  groupList: WorkOrderGroupVO[];
}

export interface WorkOrderGroupVO {
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

export interface WorkOrderVO extends ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  i18n: string;
  seq: number;
  groupId: number;
  status: string;
  workOrderKey: string;
  color: string;
  docs: string;
  icon: string;
  comment: string;
  i18nData: I18nData;
  workflow: string;
  workflowData: WorkflowModelVO;
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

export abstract class WorkOrderData {

  abstract getWorkOrderMenu(): Observable<HttpResult<WorkOrderMenuVO>>;

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
