import { Component, OnInit } from '@angular/core';
import { WorkOrderKeyEnum, WorkOrderService } from '../../../../../@core/services/work-order.service';
import { WorkOrderPageQuery, WorkOrderStatus, WorkOrderVO } from '../../../../../@core/data/work-order';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { ToastUtil } from '../../../../../@shared/utils/toast.util';
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
      title: WorkOrderStatus.IN_APPROVAL.replace('_',' '),
    },
    {
      id: WorkOrderStatus.IN_PROGRESS,
      title: WorkOrderStatus.IN_PROGRESS.replace('_',' '),
    },
    {
      id: WorkOrderStatus.COMPLETED,
      title: WorkOrderStatus.COMPLETED,
    },
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private workOrderService: WorkOrderService,
              private workOrderTicketService: WorkOrderTicketService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      if (param['ticketNo'] !== undefined) {
        this.queryParam.ticketNo = param['ticketNo'];
      }
    });
    this.fetchData();
  }

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '70%',
      maxHeight: '1000px',
    },
  };

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

  onRowDialog(workOrderKey: string, ticket: WorkOrderTicketDetailsVO) {
    let dialogDate = {
      ...this.dialogDate.editorData,
    };
    switch (workOrderKey) {
      case WorkOrderKeyEnum.APPLICATION_PERMISSION:
        dialogDate['content'] = WorkOrderApplicationTicketComponent;
        dialogDate['title'] = 'Application Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket, { businessType: BusinessTypeEnum.APPLICATION });
        break;
      case WorkOrderKeyEnum.COMPUTER_PERMISSION:
        dialogDate['content'] = WorkOrderComputerTicketComponent;
        dialogDate['title'] = 'Computer Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket, { businessType: BusinessTypeEnum.TAG_GROUP });
        break;
      case WorkOrderKeyEnum.REVOKE_USER_PERMISSION:
        dialogDate['content'] = WorkOrderUserRevokeTicketComponent;
        dialogDate['title'] = 'User Permission Revoke';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.GITLAB_PROJECT_PERMISSION:
        dialogDate['content'] = WorkOrderGitlabProjectTicketComponent;
        dialogDate['title'] = 'GitLab Project Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.GITLAB_GROUP_PERMISSION:
        dialogDate['content'] = WorkOrderGitlabGroupTicketComponent;
        dialogDate['title'] = 'GitLab Group Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_ELASTIC_SCALING:
        dialogDate['content'] = WorkOrderElasticScalingTicketComponent;
        dialogDate['title'] = 'Elastic Scaling';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_DATAWORKS_AK:
        dialogDate['content'] = WorkOrderAliyunDataworksTicketComponent;
        dialogDate['title'] = 'Dataworks AK Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.APPLICATION_DELETE_POD:
        dialogDate['content'] = WorkOrderPodDeleteTicketComponent;
        dialogDate['title'] = 'Application Pod Delete';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_RAM_USER_PERMISSION:
        dialogDate['content'] = WorkOrderAliyunRamTicketComponent;
        dialogDate['title'] = 'Aliyun RAM User Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_RAM_POLICY_PERMISSION:
        dialogDate['content'] = WorkOrderAliyunRamPolicyTicketComponent;
        dialogDate['title'] = 'Aliyun RAM Policy Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIYUN_RAM_USER_RESET:
        dialogDate['content'] = WorkOrderAliyunRamResetTicketComponent;
        dialogDate['title'] = 'Aliyun RAM Reset';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.LDAP_ROLE_PERMISSION:
        dialogDate['content'] = WorkOrderLdapIdentityTicketComponent;
        dialogDate['title'] = 'Ldap Role Permission';
        this.dialogUtil.onEditWithoutButtonDialog(ADD_OPERATION, dialogDate, () => {
          this.fetchData();
        }, ticket);
        break;
      case WorkOrderKeyEnum.ALIMAIL_USER_RESET:
        dialogDate['content'] = WorkOrderAlimailIdentityResetTicketComponent;
        dialogDate['title'] = 'Alimail Reset Password';
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
