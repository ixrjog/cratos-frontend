import { Component } from '@angular/core';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import {
  TicketPageQuery,
  WorkOrderTicketDetailsVO,
  WorkOrderTicketVO,
} from '../../../../@core/data/work-order-ticket';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { WorkOrderPageQuery, WorkOrderStatus, WorkOrderVO } from '../../../../@core/data/work-order';
import { UserPageQuery, UserVO } from '../../../../@core/data/user';
import { UserService } from '../../../../@core/services/user.service';
import { WorkOrderTicketService } from '../../../../@core/services/work-order-ticket.service';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { map } from 'rxjs/operators';
import { WorkOrderKeyEnum, WorkOrderService } from '../../../../@core/services/work-order.service';
import { getPopoverStyle } from 'src/app/@shared/utils/theme.util';
import {
  WorkOrderUserRevokeTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-user-revoke-ticket/work-order-user-revoke-ticket.component';
import {
  WorkOrderElasticScalingTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-elastic-scaling-ticket/work-order-elastic-scaling-ticket.component';
import {
  WorkOrderAliyunDataworksTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-aliyun-dataworks-ticket/work-order-aliyun-dataworks-ticket.component';
import {
  WorkOrderPodDeleteTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-pod-delete-ticket/work-order-pod-delete-ticket.component';
import {
  WorkOrderAliyunRamTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-ticket/work-order-aliyun-ram-ticket/work-order-aliyun-ram-ticket.component';
import {
  WorkOrderApplicationTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-application-ticket/work-order-application-ticket.component';
import {
  WorkOrderComputerTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-computer-ticket/work-order-computer-ticket.component';
import {
  WorkOrderGitlabProjectTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-project-ticket/work-order-gitlab-project-ticket.component';
import {
  WorkOrderGitlabGroupTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-group-ticket/work-order-gitlab-group-ticket.component';
import {
  WorkOrderAliyunRamPolicyTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-cloud-policy-ticket/work-order-aliyun-ram-policy-ticket/work-order-aliyun-ram-policy-ticket.component';
import {
  WorkOrderAliyunRamResetTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-reset-ticket/work-order-aliyun-ram-reset-ticket/work-order-aliyun-ram-reset-ticket.component';
import {
  WorkOrderLdapIdentityTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-ldap-identity-ticket/work-order-ldap-identity-ticket.component';
import {
  WorkOrderAlimailIdentityResetTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-mail-identity-reset-ticket/work-order-alimail-identity-reset-ticket/work-order-alimail-identity-reset-ticket.component';
import {
  WorkOrderAwsIamResetTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-reset-ticket/work-order-aws-iam-reset-ticket/work-order-aws-iam-reset-ticket.component';
import {
  WorkOrderAwsTransferSftpTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-aws-transfer-sftp-ticket/work-order-aws-transfer-sftp-ticket.component';
import {
  WorkOrderAwsIamPolicyTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-cloud-policy-ticket/work-order-aws-iam-policy-ticket/work-order-aws-iam-policy-ticket.component';
import {
  WorkOrderApplicationProdTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-application-prod-ticket/work-order-application-prod-ticket.component';
import {
  WorkOrderApplicationTestTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-application-test-ticket/work-order-application-test-ticket.component';
import {
  WorkOrderAliyunOnsTopicTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-aliyun-ons-ticket/work-order-aliyun-ons-topic-ticket/work-order-aliyun-ons-topic-ticket.component';
import {
  WorkOrderAliyunOnsConsumeGroupTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-aliyun-ons-ticket/work-order-aliyun-ons-consume-group-ticket/work-order-aliyun-ons-consume-group-ticket.component';
import {
  WorkOrderApplicationFrontendTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-application-frontend-ticket/work-order-application-frontend-ticket.component';
import {
  WorkOrderAliyunKmsSecretTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-aliyun-kms-secret-ticket/work-order-aliyun-kms-secret-ticket.component';

@Component({
  selector: 'app-work-order-ticket-management-data-table',
  templateUrl: './work-order-ticket-management-data-table.component.html',
  styleUrls: [ './work-order-ticket-management-data-table.component.less' ],
})
export class WorkOrderTicketManagementDataTableComponent {

  protected readonly limit = RELATIVE_TIME_LIMIT;

  table: Table<WorkOrderTicketVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  queryParam = {
    ticketNo: '',
    ticketState: '',
    workOrderKey: '',
    username: '',
  };
  workOrder: WorkOrderVO;
  user: UserVO;
  ticketStateOptions = [
    {
      id: '',
      title: 'ALL',
    },
    {
      id: WorkOrderStatus.NEW,
      title: WorkOrderStatus.NEW,
    },
    {
      id: WorkOrderStatus.IN_APPROVAL,
      title: WorkOrderStatus.IN_APPROVAL.replace('_', ' '),
    },
    {
      id: WorkOrderStatus.IN_PROGRESS,
      title: WorkOrderStatus.IN_PROGRESS.replace('_', ' '),
    },
    {
      id: WorkOrderStatus.COMPLETED,
      title: WorkOrderStatus.COMPLETED,
    },
  ];

  constructor(private userService: UserService,
              private workOrderService: WorkOrderService,
              private workOrderTicketService: WorkOrderTicketService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '70%',
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  onTicketStateChange(tab) {
    this.queryParam.ticketState = tab;
    this.fetchData();
  }

  fetchData() {
    const param: TicketPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.workOrderTicketService.queryTicketPage(param));
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
    this.queryParam.workOrderKey = workOrder?.workOrderKey;
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

  onRowEdit(rowItem: WorkOrderTicketVO) {
    this.workOrderTicketService.getTicket({ ticketNo: rowItem.ticketNo })
      .subscribe(({ body }) => {
        this.onRowDialog(rowItem.workOrder.workOrderKey, body);
      });
  }

  onRowNext(rowItem: WorkOrderTicketVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.update,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketService.doNextStateOfTicket({ ticketNo: rowItem.ticketNo })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
          this.fetchData();
        });
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
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowDelete(rowItem: WorkOrderTicketVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketService.adminDeleteTicketById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
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
      case WorkOrderKeyEnum.ALIYUN_RAM_POLICY_PERMISSION:
        dialogDate['content'] = WorkOrderAliyunRamPolicyTicketComponent;
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
}
