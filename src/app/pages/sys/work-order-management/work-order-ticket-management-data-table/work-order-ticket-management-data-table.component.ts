import { Component } from '@angular/core';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { TicketPageQuery, WorkOrderTicketDetailsVO, WorkOrderTicketVO } from '../../../../@core/data/work-order-ticket';
import { WorkOrderPageQuery, WorkOrderStatus, WorkOrderVO } from '../../../../@core/data/work-order';
import { UserPageQuery, UserVO } from '../../../../@core/data/user';
import { UserService } from '../../../../@core/services/user.service';
import { WorkOrderTicketService } from '../../../../@core/services/work-order-ticket.service';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { map } from 'rxjs/operators';
import { WorkOrderKeyEnum, WorkOrderService } from '../../../../@core/services/work-order.service';
import {
  WorkOrderApplicationTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-application-ticket/work-order-application-ticket.component';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import {
  WorkOrderComputerTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-computer-ticket/work-order-computer-ticket.component';
import { getPopoverStyle } from 'src/app/@shared/utils/theme.util';
import {
  WorkOrderUserRevokeTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-user-revoke-ticket/work-order-user-revoke-ticket.component';
import {
  WorkOrderGitlabProjectTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-gitlab-project-ticket/work-order-gitlab-project-ticket.component';
import {
  WorkOrderGitlabGroupTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-gitlab-group-ticket/work-order-gitlab-group-ticket.component';
import {
  WorkOrderElasticScalingTicketComponent,
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-elastic-scaling-ticket/work-order-elastic-scaling-ticket.component';
import {
  WorkOrderAliyunDataworksTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-aliyun-dataworks-ticket/work-order-aliyun-dataworks-ticket.component';
import {
  WorkOrderPodDeleteTicketComponent
} from '../../../workbench/work-order/work-order-layout/work-order-ticket/work-order-pod-delete-ticket/work-order-pod-delete-ticket.component';

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
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketService.deleteTicketById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
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
        dialogDate['title'] = 'User Revoke';
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
        dialogDate['title'] = 'Application Elastic Scaling';
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
