import { Component, OnInit } from '@angular/core';
import { WorkOrderKeyEnum, WorkOrderService } from '../../../../../@core/services/work-order.service';
import { WorkOrderPageQuery, WorkOrderStatus, WorkOrderVO } from '../../../../../@core/data/work-order';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { WorkOrderTicketService } from '../../../../../@core/services/work-order-ticket.service';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import {
  MyTicketPageQuery,
  WorkOrderTicketDetailsVO,
  WorkOrderTicketVO,
} from '../../../../../@core/data/work-order-ticket';
import { onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { UserPageQuery, UserVO } from '../../../../../@core/data/user';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../../@core/services/user.service';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/constant/date.constant';
import { getPopoverStyle } from '../../../../../@shared/utils/theme.util';
import {
  WorkOrderUserRevokeTicketComponent,
} from '../work-order-ticket/work-order-user-revoke-ticket/work-order-user-revoke-ticket.component';
import { ActivatedRoute } from '@angular/router';
import {
  WorkOrderElasticScalingTicketComponent,
} from '../work-order-ticket/work-order-elastic-scaling-ticket/work-order-elastic-scaling-ticket.component';
import {
  WorkOrderAliyunDataworksTicketComponent,
} from '../work-order-ticket/work-order-aliyun-dataworks-ticket/work-order-aliyun-dataworks-ticket.component';
import {
  WorkOrderPodDeleteTicketComponent,
} from '../work-order-ticket/work-order-pod-delete-ticket/work-order-pod-delete-ticket.component';
import {
  WorkOrderApplicationTicketComponent,
} from '../work-order-ticket/work-order-business-permission-ticket/work-order-application-ticket/work-order-application-ticket.component';
import {
  WorkOrderComputerTicketComponent,
} from '../work-order-ticket/work-order-business-permission-ticket/work-order-computer-ticket/work-order-computer-ticket.component';
import {
  WorkOrderGitlabProjectTicketComponent,
} from '../work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-project-ticket/work-order-gitlab-project-ticket.component';
import {
  WorkOrderGitlabGroupTicketComponent,
} from '../work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-group-ticket/work-order-gitlab-group-ticket.component';
import {
  WorkOrderAliyunRamTicketComponent,
} from '../work-order-ticket/work-order-cloud-identity-ticket/work-order-aliyun-ram-ticket/work-order-aliyun-ram-ticket.component';
import {
  WorkOrderAliyunRamPolicyTicketComponent,
} from '../work-order-ticket/work-order-cloud-policy-ticket/work-order-aliyun-ram-policy-ticket/work-order-aliyun-ram-policy-ticket.component';
import {
  WorkOrderAliyunRamResetTicketComponent,
} from '../work-order-ticket/work-order-cloud-identity-reset-ticket/work-order-aliyun-ram-reset-ticket/work-order-aliyun-ram-reset-ticket.component';
import {
  WorkOrderLdapIdentityTicketComponent,
} from '../work-order-ticket/work-order-ldap-identity-ticket/work-order-ldap-identity-ticket.component';
import {
  WorkOrderAlimailIdentityResetTicketComponent,
} from '../work-order-ticket/work-order-mail-identity-reset-ticket/work-order-alimail-identity-reset-ticket/work-order-alimail-identity-reset-ticket.component';
import {
  WorkOrderAwsIamResetTicketComponent,
} from '../work-order-ticket/work-order-cloud-identity-reset-ticket/work-order-aws-iam-reset-ticket/work-order-aws-iam-reset-ticket.component';
import {
  WorkOrderAwsTransferSftpTicketComponent,
} from '../work-order-ticket/work-order-aws-transfer-sftp-ticket/work-order-aws-transfer-sftp-ticket.component';
import {
  WorkOrderAwsIamPolicyTicketComponent,
} from '../work-order-ticket/work-order-cloud-policy-ticket/work-order-aws-iam-policy-ticket/work-order-aws-iam-policy-ticket.component';
import {
  WorkOrderApplicationProdTicketComponent,
} from '../work-order-ticket/work-order-business-permission-ticket/work-order-application-prod-ticket/work-order-application-prod-ticket.component';
import {
  WorkOrderApplicationTestTicketComponent,
} from '../work-order-ticket/work-order-business-permission-ticket/work-order-application-test-ticket/work-order-application-test-ticket.component';
import {
  WorkOrderAliyunOnsTopicTicketComponent,
} from '../work-order-ticket/work-order-aliyun-ons-ticket/work-order-aliyun-ons-topic-ticket/work-order-aliyun-ons-topic-ticket.component';
import {
  WorkOrderAliyunOnsConsumeGroupTicketComponent,
} from '../work-order-ticket/work-order-aliyun-ons-ticket/work-order-aliyun-ons-consume-group-ticket/work-order-aliyun-ons-consume-group-ticket.component';
import {
  WorkOrderApplicationFrontendTicketComponent,
} from '../work-order-ticket/work-order-application-frontend-ticket/work-order-application-frontend-ticket.component';
import {
  WorkOrderAliyunKmsSecretTicketComponent,
} from '../work-order-ticket/work-order-aliyun-kms-secret-ticket/work-order-aliyun-kms-secret-ticket.component';
import {
  WorkOrderRiskChangeTicketComponent,
} from '../work-order-ticket/work-order-risk-change-ticket/work-order-risk-change-ticket.component';
import { TranslateService } from '@ngx-translate/core';
import {
  WorkOrderAliyunKmsSecretUpdateTicketComponent,
} from '../work-order-ticket/work-order-aliyun-kms-secret-update-ticket/work-order-aliyun-kms-secret-update-ticket.component';
import {
  WorkOrderApplicationRedeployTicketComponent,
} from '../work-order-ticket/work-order-application-redeploy-ticket/work-order-application-redeploy-ticket.component';
import {
  WorkOrderUserPasswordResetTicketComponent,
} from '../work-order-ticket/work-order-user-password-reset-ticket/work-order-user-password-reset-ticket.component';
import {
  WorkOrderAwsIamTicketComponent
} from '../work-order-ticket/work-order-cloud-identity-ticket/work-order-aws-iam-ticket/work-order-aws-iam-ticket.component';
import {
  WorkOrderApplicationJvmTicketComponent
} from '../work-order-ticket/work-order-application-jvm-ticket/work-order-application-jvm-ticket.component';
import {
  WorkOrderGcpIamRoleTicketComponent
} from '../work-order-ticket/work-order-cloud-policy-ticket/work-order-gcp-iam-role-ticket/work-order-gcp-iam-role-ticket.component';
import {
  WorkOrderGcpIamTicketComponent
} from '../work-order-ticket/work-order-cloud-identity-ticket/work-order-gcp-iam-ticket/work-order-gcp-iam-ticket.component';

@Component({
  selector: 'app-work-order-data-table',
  templateUrl: './work-order-data-table.component.html',
  styleUrls: [ './work-order-data-table.component.less' ],
})
export class WorkOrderDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;

  table: Table<WorkOrderTicketVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  queryParam = {
    ticketNo: '',
    ticketState: '',
    username: '',
    mySubmitted: false,
  };
  workOrder: WorkOrderVO = null;
  user: UserVO;
  ticketStateOptions = [];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private workOrderService: WorkOrderService,
              private workOrderTicketService: WorkOrderTicketService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.get('workOrderTicket').subscribe((res) => {
      this.onGetTicketStateOptions(res);
    });
    this.activatedRoute.queryParams.subscribe(param => {
      if (param['ticketNo'] !== undefined) {
        this.queryParam.ticketNo = param['ticketNo'];
        this.queryParam.ticketState =  WorkOrderStatus.IN_APPROVAL
      }
    });
    this.fetchData();
  }

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '70%',
      maxHeight: '1000px',
    },
  };

  onGetTicketStateOptions(values: any) {
    this.ticketStateOptions = [
      {
        id: '',
        title: values['state']['all'],
      },
      {
        id: WorkOrderStatus.NEW,
        title: values['state']['new'],
      },
      {
        id: WorkOrderStatus.IN_APPROVAL,
        title: values['state']['inApproval'],
      },
      {
        id: WorkOrderStatus.IN_PROGRESS,
        title: values['state']['inProgress'],
      },
      {
        id: WorkOrderStatus.COMPLETED,
        title: values['state']['completed'],
      },
    ];
  }

  clickWorkOrder(workOrder: WorkOrderVO) {
    this.workOrder = workOrder;
    this.fetchData();
  }

  onTicketStateChange(tab) {
    this.queryParam.ticketState = tab;
    this.fetchData();
  }

  fetchData() {
    const param: MyTicketPageQuery = {
      ...this.queryParam,
      workOrderKey: this.workOrder === null ? '' : this.workOrder.workOrderKey,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.workOrderTicketService.queryMyTicketPage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onSearchWorkOrder = (term: string) => {
    const param: WorkOrderPageQuery = {
      length: 10, page: 1, queryName: term, groupId: null,
    };
    return this.workOrderService.queryWorkOrderPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((workOrder, index) => ({ id: index, option: workOrder })),
        ),
      );
  };

  onWorkOrderChange(workOrder: WorkOrderVO) {
    this.workOrder = workOrder;
  }

  onSearchUser = (term: string) => {
    const param: UserPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.userService.queryUserPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onUserChange(user: UserVO) {
    this.queryParam.username = user?.username;
  }

  onRowNew(workOrder: WorkOrderVO) {
    this.workOrderTicketService.createTicket({ workOrderKey: workOrder.workOrderKey })
      .subscribe(({ body }) => {
        this.onRowDialog(workOrder.workOrderKey, body);
      });
  }

  onRowEdit(rowItem: WorkOrderTicketVO) {
    this.workOrderTicketService.getTicket({ ticketNo: rowItem.ticketNo })
      .subscribe(({ body }) => {
        this.onRowDialog(rowItem.workOrder.workOrderKey, body);
      });
  }

  onRowClose(rowItem: WorkOrderTicketVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.close,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketService.deleteTicketById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.CLOSE);
          this.fetchData();
        });
    });
  }

  onRowDialog(workOrderKey: string, ticket: WorkOrderTicketDetailsVO) {
    const lang = localStorage.getItem('lang');
    let title = ticket.workOrder.i18nData.langMap['en-us'].displayName;
    if (lang) {
      title = ticket.workOrder.i18nData.langMap[lang].displayName;
    }
    let dialogDate = {
      ...this.dialogDate.editorData,
      title: title,
    };
    switch (workOrderKey) {
      case WorkOrderKeyEnum.APPLICATION_PERMISSION:
        dialogDate['content'] = WorkOrderApplicationTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket, { businessType: BusinessTypeEnum.APPLICATION });
        break;
      case WorkOrderKeyEnum.APPLICATION_PROD_PERMISSION:
        dialogDate['content'] = WorkOrderApplicationProdTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket, { businessType: BusinessTypeEnum.APPLICATION });
        break;
      case WorkOrderKeyEnum.APPLICATION_TEST_PERMISSION:
        dialogDate['content'] = WorkOrderApplicationTestTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket, { businessType: BusinessTypeEnum.APPLICATION });
        break;
      case WorkOrderKeyEnum.COMPUTER_PERMISSION:
        dialogDate['content'] = WorkOrderComputerTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket, { businessType: BusinessTypeEnum.TAG_GROUP });
        break;
      case WorkOrderKeyEnum.REVOKE_USER_PERMISSION:
        dialogDate['content'] = WorkOrderUserRevokeTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.GITLAB_PROJECT_PERMISSION:
        dialogDate['content'] = WorkOrderGitlabProjectTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.GITLAB_GROUP_PERMISSION:
        dialogDate['content'] = WorkOrderGitlabGroupTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_ELASTIC_SCALING:
        dialogDate['content'] = WorkOrderElasticScalingTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_DEPLOYMENT_JVM_SPEC:
        dialogDate['content'] = WorkOrderApplicationJvmTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_DATAWORKS_AK:
        dialogDate['content'] = WorkOrderAliyunDataworksTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_DELETE_POD:
        dialogDate['content'] = WorkOrderPodDeleteTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_RAM_USER_PERMISSION:
        dialogDate['content'] = WorkOrderAliyunRamTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.AWS_IAM_USER_PERMISSION:
        dialogDate['content'] = WorkOrderAwsIamTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_RAM_POLICY_PERMISSION:
        dialogDate['content'] = WorkOrderAliyunRamPolicyTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.GCP_IAM_PERMISSION:
        dialogDate['content'] = WorkOrderGcpIamTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_RAM_USER_RESET:
        dialogDate['content'] = WorkOrderAliyunRamResetTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.LDAP_ROLE_PERMISSION:
        dialogDate['content'] = WorkOrderLdapIdentityTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIMAIL_USER_RESET:
        dialogDate['content'] = WorkOrderAlimailIdentityResetTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.AWS_IAM_USER_RESET:
        dialogDate['content'] = WorkOrderAwsIamResetTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.AWS_TRANSFER_SFTP_USER_PERMISSION:
        dialogDate['content'] = WorkOrderAwsTransferSftpTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.AWS_IAM_POLICY_PERMISSION:
        dialogDate['content'] = WorkOrderAwsIamPolicyTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.GCP_IAM_ROLE_PERMISSION:
        dialogDate['content'] = WorkOrderGcpIamRoleTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_ONS_TOPIC:
        dialogDate['content'] = WorkOrderAliyunOnsTopicTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_ONS_CONSUMER_GROUP:
        dialogDate['content'] = WorkOrderAliyunOnsConsumeGroupTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_FRONTEND_CREATE:
        dialogDate['content'] = WorkOrderApplicationFrontendTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_KMS_SECRET_CREATE:
        dialogDate['content'] = WorkOrderAliyunKmsSecretTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_KMS_SECRET_UPDATE:
        dialogDate['content'] = WorkOrderAliyunKmsSecretUpdateTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.RISK_CHANGE:
        dialogDate['content'] = WorkOrderRiskChangeTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_REDEPLOY:
        dialogDate['content'] = WorkOrderApplicationRedeployTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.USER_RESET_PASSWORD:
        dialogDate['content'] = WorkOrderUserPasswordResetTicketComponent;
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      default:
        this.toastUtil.onErrorToast('nonsupport workOrder');
        throw new Error('nonsupport workOrder');
    }
  }

  protected readonly getPopoverStyle = getPopoverStyle;
  protected readonly WorkOrderStatus = WorkOrderStatus;

  onGetTicketStateColor(rowItem: WorkOrderTicketVO) {
    if (rowItem.ticketState === WorkOrderStatus.COMPLETED) {
      if (rowItem.success) {
        return 'green-w98';
      }
      return 'red-w98';
    }
    return 'blue-w98';
  }

  onGetTicketUrl(ticketNo: string): string {
    const href = window.location.href;
    const [base, hash] = href.split('#');
    if (!hash) return href + '?ticketNo=' + ticketNo;
    const [path, query] = hash.split('?');
    const params = new URLSearchParams(query);
    params.set('ticketNo', ticketNo);
    return base + '#' + path + '?' + params.toString();
  }
}
