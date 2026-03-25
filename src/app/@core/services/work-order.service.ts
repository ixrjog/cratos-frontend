import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  UpdateWorkOrder,
  UpdateWorkOrderGroup,
  WorkOrderData,
  WorkOrderGroupPageQuery,
  WorkOrderGroupVO,
  WorkOrderMenuVO,
  WorkOrderPageQuery,
  WorkOrderReportMonthlyVO,
  WorkOrderVO,
} from '../data/work-order';
import { Observable } from 'rxjs';
import { DataTable, HttpResult, ReportBaseData } from '../data/base-data';

@Injectable()
export class WorkOrderService extends WorkOrderData {

  baseUrl = '/workorder';

  constructor(private apiService: ApiService) {
    super();
  }

  getWorkOrderMenu(): Observable<HttpResult<WorkOrderMenuVO>> {
    return this.apiService.get(this.baseUrl, '/menu/get', {});
  }

  queryWorkOrderGroupPage(param: WorkOrderGroupPageQuery): Observable<DataTable<WorkOrderGroupVO>> {
    return this.apiService.post(this.baseUrl, '/group/page/query', param);
  }

  queryWorkOrderPage(param: WorkOrderPageQuery): Observable<DataTable<WorkOrderVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  updateWorkOrder(param: UpdateWorkOrder): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  updateWorkOrderGroup(param: UpdateWorkOrderGroup): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/group/update', param);
  }

  getWorkOrderNameReport(): Observable<HttpResult<Array<ReportBaseData>>> {
    return this.apiService.get(this.baseUrl, '/report/name', {});
  }

  getWorkOrderMonthlyReport(): Observable<HttpResult<WorkOrderReportMonthlyVO>> {
    return this.apiService.get(this.baseUrl, '/report/monthly', {});
  }

}


export enum WorkOrderKeyEnum {

  APPLICATION_PERMISSION = 'APPLICATION_PERMISSION',
  APPLICATION_PROD_PERMISSION = 'APPLICATION_PROD_PERMISSION',
  APPLICATION_TEST_PERMISSION = 'APPLICATION_TEST_PERMISSION',

  APPLICATION_FRONTEND_CREATE = 'APPLICATION_FRONTEND_CREATE',
  APPLICATION_DEPLOYMENT_JVM_SPEC = 'APPLICATION_DEPLOYMENT_JVM_SPEC',

  COMPUTER_PERMISSION = 'COMPUTER_PERMISSION',
  SERVER_ACCOUNT_PERMISSION = 'SERVER_ACCOUNT_PERMISSION',
  APPLICATION_ELASTIC_SCALING = 'APPLICATION_ELASTIC_SCALING',
  REVOKE_USER_PERMISSION = 'REVOKE_USER_PERMISSION',
  GITLAB_PROJECT_PERMISSION = 'GITLAB_PROJECT_PERMISSION',
  GITLAB_GROUP_PERMISSION = 'GITLAB_GROUP_PERMISSION',
  ALIYUN_DATAWORKS_AK= 'ALIYUN_DATAWORKS_AK',
  ALIYUN_KMS_SECRET_CREATE='ALIYUN_KMS_SECRET_CREATE',
  ALIYUN_KMS_SECRET_UPDATE='ALIYUN_KMS_SECRET_UPDATE',
  APPLICATION_DELETE_POD = 'APPLICATION_DELETE_POD',
  APPLICATION_REDEPLOY = 'APPLICATION_REDEPLOY',
  LDAP_ROLE_PERMISSION = 'LDAP_ROLE_PERMISSION',

  ALIYUN_RAM_USER_PERMISSION = 'ALIYUN_RAM_USER_PERMISSION',
  ALIYUN_RAM_POLICY_PERMISSION = 'ALIYUN_RAM_POLICY_PERMISSION',
  ALIYUN_RAM_USER_RESET = 'ALIYUN_RAM_USER_RESET',

  ALIYUN_ONS_TOPIC ='ALIYUN_ONS_TOPIC',
  ALIYUN_ONS_CONSUMER_GROUP ='ALIYUN_ONS_CONSUMER_GROUP',

  ALIMAIL_USER_RESET = 'ALIMAIL_USER_RESET',
  USER_RESET_PASSWORD = 'USER_RESET_PASSWORD',

  AWS_IAM_USER_RESET = 'AWS_IAM_USER_RESET',
  AWS_TRANSFER_SFTP_USER_PERMISSION = 'AWS_TRANSFER_SFTP_USER_PERMISSION',
  AWS_IAM_POLICY_PERMISSION = 'AWS_IAM_POLICY_PERMISSION',
  AWS_IAM_USER_PERMISSION= 'AWS_IAM_USER_PERMISSION',

  GCP_IAM_PERMISSION = 'GCP_IAM_PERMISSION',
  GCP_IAM_ROLE_PERMISSION = 'GCP_IAM_ROLE_PERMISSION',

  RISK_CHANGE = 'RISK_CHANGE'
}

