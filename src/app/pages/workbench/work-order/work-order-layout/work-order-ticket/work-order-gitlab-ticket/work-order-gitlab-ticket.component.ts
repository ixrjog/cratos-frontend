import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import {
  AssetPageQuery,
  EdsAssetVO,
  EdsInstanceVO,
  InstancePageQuery,
} from '../../../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { GitLabPermission } from '../../../../../../@core/data/work-order-ticket-entry';


@Component({
  selector: 'app-work-order-gitlab-ticket',
  templateUrl: './work-order-gitlab-ticket.component.html',
  styleUrls: [ './work-order-gitlab-ticket.component.less' ],
})
export class WorkOrderGitlabTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() assetType: string;
  @Output() onAddTicketEntry = new EventEmitter<GitLabPermission>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();

  gitLabPermission: EdsAssetVO;
  gitLabInstance: EdsInstanceVO = null;

  gitlabRole: string;
  gitlabRoleOptions = [
    {
      name: 'REPORTER',
      value: 'REPORTER',
      disabled: false,
    },
    {
      name: 'DEVELOPER',
      value: 'DEVELOPER',
      disabled: false,
    },
    {
      name: 'MAINTAINER',
      value: 'MAINTAINER',
      disabled: false,
    },
    {
      name: 'OWNER',
      value: 'OWNER',
      disabled: true,
    },
  ];

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsService: EdsService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
  }

  onSearchGitLabInstance = (term: string) => {
    const param: InstancePageQuery = {
      edsType: 'GITLAB', length: 10, page: 1, queryName: term,
    };
    return this.edsService.queryEdsInstancePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((permission, index) => ({ id: index, option: permission })),
        ),
      );
  };

  onGitLabInstanceChange(edsInstance: EdsInstanceVO) {
    this.gitLabInstance = edsInstance;
  }

  onSearchGitLabPermission = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.gitLabInstance?.id, assetType: this.assetType, valid: true, length: 10, page: 1, queryName: term,
    };
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((permission, index) => ({ id: index, option: permission })),
        ),
      );
  };

  onGitLabPermissionChange(edsAsset: EdsAssetVO) {
    this.gitLabPermission = edsAsset;
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    if (this.gitLabPermission === undefined) {
      this.toastUtil.onErrorToast('Choose at least one gitlab permission');
      return;
    }
    if (this.gitlabRole === undefined) {
      this.toastUtil.onErrorToast('gitlab role cannot be empty');
      return;
    }
    const permission: GitLabPermission = {
      target: this.gitLabPermission,
      role: this.gitlabRole,
    };
    this.onAddTicketEntry.emit(permission);
  }

  onRowRemove(entry: WorkOrderTicketEntryVO<GitLabPermission>) {
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
  }

  onFetchData() {
    this.workOrderBaseTicketComponent.onGetTicketDetail();
  }

  onCancel() {
    this.onHideDialog.emit();
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly JSON = JSON;
}
