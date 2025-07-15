import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { AssetPageQuery, EdsAssetVO, EdsInstanceVO } from '../../../../../../@core/data/ext-datasource';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';

@Component({
  selector: 'app-work-order-aliyun-kms-secret-update-ticket',
  templateUrl: './work-order-aliyun-kms-secret-update-ticket.component.html',
  styleUrls: [ './work-order-aliyun-kms-secret-update-ticket.component.less' ],
})
export class WorkOrderAliyunKmsSecretUpdateTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;
  username: string;
  ticketDetails: WorkOrderTicketDetailsVO;
  loading: boolean = false;
  aliyunInstance: EdsInstanceVO;
  kmsSecret: EdsAssetVO;
  secretData: string;
  versionId: string = new Date().toISOString();
  riskCheck: boolean = false;
  showAlert: boolean = false;

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
    this.username = localStorage.getItem('username');
    this.ticketDetails = this.data['formData'];
  }

  onSearchCloudInstance = (term: string) => {
    return this.workOrderTicketEntryService.queryAliyunKmsInstanceTicketEntry()
      .pipe(
        map(({ body }) =>
          body.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onSearchKmsSecret = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.aliyunInstance?.id,
      assetType: 'ALIYUN_KMS_SECRET',
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

  onKmsSecretChange(kmsSecret: EdsAssetVO) {
    if (this.kmsSecret === undefined) {
      this.showAlert = false;
    }
    const isCreator = kmsSecret?.businessTags?.some(tag =>
      tag.tag.tagKey === 'CreatedBy' && tag.tagValue === this.username
    );
    this.showAlert = !isCreator;
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addUpdateAliyunKmsSecretTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      instanceId: this.aliyunInstance.id,
      detail: {
        edsInstance: this.aliyunInstance,
        secret: this.kmsSecret,
        secretData: this.secretData,
        versionId: this.versionId,
        confirmTheRiskOfChange: this.riskCheck
      },
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  onRowRemove(rowItem: WorkOrderTicketEntryVO<any>) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketEntryService.deleteTicketEntryById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData();
        });
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onFetchData() {
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.data.hideDialog();
  }

  onRiskCheckChange(value) {
    this.riskCheck = value;
  }


  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
}
