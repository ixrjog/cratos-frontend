import { HttpResult, I18nData } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { Observable } from 'rxjs';

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

export interface WorkOrderVO extends BusinessDocsVO, BusinessTagsVO {
  id: number;
  name: string;
  i18n: string;
  seq: number;
  groupType: string;
  icon: string;
  comment: string;
  i18nData: I18nData;
}

export abstract class WorkOrderData {

  abstract getWorkOrderMenu(): Observable<HttpResult<WorkOrderMenuVO>>;

}
