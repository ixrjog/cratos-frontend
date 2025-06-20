import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { finalize } from 'rxjs';
import { CreateAliyunOnsResource } from '../../../../../../@core/data/work-order-ticket-entry';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { AssetPageQuery, EdsAssetVO, EdsInstanceVO } from '../../../../../../@core/data/ext-datasource';
import { map } from 'rxjs/operators';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';

@Component({
  selector: 'app-work-order-aliyun-ons-ticket',
  templateUrl: './work-order-aliyun-ons-ticket.component.html',
  styleUrls: [ './work-order-aliyun-ons-ticket.component.less' ],
})
export class WorkOrderAliyunOnsTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() editTicketEntryExtTemplate: TemplateRef<any>;
  @Input() showTicketEntryExtTemplate: TemplateRef<any>;
  @Output() onAddTicketEntry = new EventEmitter<CreateAliyunOnsResource>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();
  aliyunInstance: EdsInstanceVO;
  onsInstance: EdsAssetVO;
  remark: string = '';
  loading: boolean = false;

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

  onSearchCloudInstance = (term: string) => {
    return this.workOrderTicketEntryService.queryRocketMqInstanceTicketEntry()
      .pipe(
        map(({ body }) =>
          body.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onSearchOnsInstance = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.aliyunInstance?.id,
      assetType: 'ALIYUN_ONS_V5_INSTANCE',
      valid: true,
      length: 10,
      page: 1,
      queryName: term,
    };
    this.loading = true;
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
        map(({ body }) =>
          body.data.map((onsInstance, index) => ({ id: index, option: onsInstance })),
        ),
      );
  };

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    if (this.aliyunInstance === undefined) {
      this.toastUtil.onErrorToast('Choose at least one aliyun instance');
      return;
    }
    if (this.onsInstance === undefined) {
      this.toastUtil.onErrorToast('Choose at least one ons instance');
      return;
    }
    if (this.remark === '') {
      this.toastUtil.onErrorToast('remark can not be empty');
      return;
    }
    const createAliyunOnsResource: CreateAliyunOnsResource = {
      edsInstance: this.aliyunInstance,
      regionId: this.onsInstance.region,
      onsInstanceName: this.onsInstance.name,
      onsInstanceId: this.onsInstance.assetKey,
      remark: this.remark,
    };
    this.onAddTicketEntry.emit(createAliyunOnsResource);
  }

  onRowRemove(entry: WorkOrderTicketEntryVO<CreateAliyunOnsResource>) {
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
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.onHideDialog.emit();
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly JSON = JSON;
}
