import { Component, OnInit } from '@angular/core';
import { WorkOrderKeyEnum } from '../../../../../@core/services/work-order.service';
import { WorkOrderStatus, WorkOrderVO } from '../../../../../@core/data/work-order';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { ToastUtil } from '../../../../../@shared/utils/toast.util';
import { WorkOrderTicketService } from '../../../../../@core/services/work-order-ticket.service';
import {
  WorkOrderApplicationTicketComponent,
} from '../work-order-ticket/work-order-application-ticket/work-order-application-ticket.component';
import {
  WorkOrderComputerTicketComponent,
} from '../work-order-ticket/work-order-computer-ticket/work-order-computer-ticket.component';
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
  WorkOrderUserRevokeTicketComponent
} from '../work-order-ticket/work-order-user-revoke-ticket/work-order-user-revoke-ticket.component';

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


  constructor(private userService: UserService,
              private workOrderTicketService: WorkOrderTicketService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '70%',
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
        }, ticket, { businessType: BusinessTypeEnum.USER });
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
