import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import {
  PermissionBusinessVO,
  UserBusinessPermission,
  UserPermissionBusinessPageQuery,
} from '../../../../../../@core/data/user-permission';
import { UserPermissionService } from '../../../../../../@core/services/user-permission.service';
import { map } from 'rxjs/operators';
import { EnvService } from '../../../../../../@core/services/env.service';
import { EnvPageQuery } from '../../../../../../@core/data/env';
import { FormLayout } from 'ng-devui/form';
import { RenewalExtUserTypeEnum } from '../../../../../../@core/data/user';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { PROD } from '../../../../../../@shared/constant/env-group.constant';

@Component({
  selector: 'app-work-order-business-permission-ticket',
  templateUrl: './work-order-business-permission-ticket.component.html',
  styleUrls: [ './work-order-business-permission-ticket.component.less' ],
})
export class WorkOrderBusinessPermissionTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() editTicketEntryTipsTemplate: TemplateRef<any>;
  @ViewChild('workOrderTicketSearch') custom: TemplateRef<any>;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() businessType: string;
  @Output() onAddTicketEntry = new EventEmitter<UserBusinessPermission>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();
  @Input() envGroup: string = '';

  ticketEntryMap = new Map<string, WorkOrderTicketEntryVO<UserBusinessPermission>[]>();
  userBusinessPermission: PermissionBusinessVO = null;
  namespaceOptions = [];
  namespaces = [];

  renewalTypeOptions = [
    RenewalExtUserTypeEnum.SHORT_TERM,
    RenewalExtUserTypeEnum.MID_TERM,
    RenewalExtUserTypeEnum.LONG_TERM,
  ];

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  renewalType: string = RenewalExtUserTypeEnum.SHORT_TERM;
  renewalTypeHelpTips = 'SHORT_TERM(7 days)\nMID_TERM(30 days)\nLONG_TERM(90 days)';

  constructor(
    private userPermissionService: UserPermissionService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private envService: EnvService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    if (this.envGroup === '') {
      this.onGetNamespaceOptions();
    } else {
      this.onGetNamespaceByEnvGroupOptions();
    }
    this.onTicketEntryConvert();
  }

  onTicketEntryConvert() {
    this.ticketEntryMap = new Map<string, WorkOrderTicketEntryVO<UserBusinessPermission>[]>();
    this.ticketDetails.entries.forEach((entry) => {
      const key: string = entry.businessType;
      if (!this.ticketEntryMap.has(key)) {
        this.ticketEntryMap.set(key, []);
      }
      this.ticketEntryMap.get(key).push(entry);
    });
  }

  onGetNamespaceOptions() {
    this.namespaceOptions = [];
    const param: EnvPageQuery = {
      queryName: '', page: 1, length: 10,
    };
    this.envService.queryEnvPage(param)
      .subscribe(({ body }) => {
        this.namespaceOptions = body.data;
      });
  }

  onGetNamespaceByEnvGroupOptions() {
    this.envService.queryEnvByGroupValue({ groupValue: this.envGroup })
      .subscribe(({ body }) => {
        this.namespaceOptions = body;
      });
  }

  onSearchUserBusinessPermission = (term: string) => {
    const param: UserPermissionBusinessPageQuery = {
      businessType: this.businessType, length: 10, page: 1, queryName: term,
    };
    return this.userPermissionService.queryUserBusinessPermissionPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((permission, index) => ({ id: index, option: permission })),
        ),
      );
  };

  onUserBusinessPermissionChange(permissionBusinessVO: PermissionBusinessVO) {
    this.namespaces = [];
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    if (this.userBusinessPermission === null) {
      this.toastUtil.onErrorToast('The permission cannot be empty');
      return;
    }
    if (this.namespaces.length === 0) {
      this.toastUtil.onErrorToast('Choose at least one environment');
      return;
    }
    const userBusinessPermission: UserBusinessPermission = {
      businessId: this.userBusinessPermission.businessId,
      name: this.userBusinessPermission.name,
      roleMembers: [],
    };
    let days = 7;
    switch (this.renewalType) {
      case RenewalExtUserTypeEnum.SHORT_TERM:
        days = 7;
        break;
      case RenewalExtUserTypeEnum.MID_TERM:
        days = 30;
        break;
      case RenewalExtUserTypeEnum.LONG_TERM:
        days = 90;
        break;
    }
    this.namespaceOptions.forEach(namespace => {
      const roleMember = {
        role: namespace.envName,
        checked: this.namespaces.findIndex(item => item.envName === namespace.envName) !== -1,
        expiredTime: Date.parse(new Date(new Date().setDate(new Date().getDate() + days)).toISOString()),
      };
      userBusinessPermission.roleMembers.push(roleMember);
    });
    this.onAddTicketEntry.emit(userBusinessPermission);
  }

  onRowRemove(entry: WorkOrderTicketEntryVO<UserBusinessPermission>) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketEntryService.deleteTicketEntryById({ id: entry.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData();
        });
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.onGetTicket.emit(ticketDetails);
    this.ticketDetails = ticketDetails;
    this.onTicketEntryConvert();
  }

  onFetchData() {
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.onHideDialog.emit();
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly PROD = PROD;
}
