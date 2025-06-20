import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { AssetPageQuery, EdsAssetVO, EdsInstanceVO } from '../../../../../../@core/data/ext-datasource';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { finalize } from 'rxjs';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../@core/data/application';
import { ApplicationService } from '../../../../../../@core/services/application.service';
import { EnvPageQuery, EnvVO } from '../../../../../../@core/data/env';
import { EnvService } from '../../../../../../@core/services/env.service';

@Component({
  selector: 'app-work-order-aliyun-kms-secret-ticket',
  templateUrl: './work-order-aliyun-kms-secret-ticket.component.html',
  styleUrls: [ './work-order-aliyun-kms-secret-ticket.component.less' ],
})
export class WorkOrderAliyunKmsSecretTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  loading = {
    kmsInstance: false,
    encryptionKey: false,
  };
  application: ApplicationVO;
  aliyunInstance: EdsInstanceVO;
  kmsInstance: EdsAssetVO;
  secretName: string;
  secretData: string;
  versionId: string = 'V1';
  encryptionKey: EdsAssetVO;
  description: string;
  envOptions = [];
  tabActiveId: string | number = '';

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private envService: EnvService,
    private edsService: EdsService,
    private applicationService: ApplicationService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.onGetEnvOptions();
  }

  onSearchCloudInstance = (term: string) => {
    return this.workOrderTicketEntryService.queryAliyunKmsInstanceTicketEntry()
      .pipe(
        map(({ body }) =>
          body.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onSearchKmsInstance = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.aliyunInstance?.id,
      assetType: 'ALIYUN_KMS_INSTANCE',
      valid: true,
      length: 10,
      page: 1,
      queryName: term,
    };
    this.loading.kmsInstance = true;
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        finalize(() => {
          this.loading.kmsInstance = false;
        }),
        map(({ body }) =>
          body.data.map((onsInstance, index) => ({ id: index, option: onsInstance })),
        ),
      );
  };

  onSearchKmsEncryptionKey = (term: string) => {
    this.loading.encryptionKey = true;
    return this.workOrderTicketEntryService.queryAliyunKmsKeyTicketEntry({ kmsInstanceId: this.kmsInstance?.assetId })
      .pipe(
        finalize(() => {
          this.loading.encryptionKey = false;
        }),
        map(({ body }) =>
          body.map((kmsEncryptionKey, index) => ({ id: index, option: kmsEncryptionKey })),
        ),
      );
  };

  onSearchApplication = (term: string) => {
    const param: ApplicationPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.applicationService.queryApplicationPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((application, index) => ({ id: index, option: application })),
        ),
      );
  };

  onApplicationChange(application: ApplicationVO) {
    this.secretName = this.tabActiveId + '_' + application.name;
  }

  onGetEnvOptions() {
    this.envOptions = [];
    const param: EnvPageQuery = {
      queryName: '', page: 1, length: 10,
    };
    this.envService.queryEnvPage(param)
      .subscribe(({ body }) => {
        this.envOptions = body.data;
        this.tabActiveId = this.envOptions[0].envName;
      });
  }

  onEnvChange(tab) {
    this.secretName = tab + '_' + this.application?.name;
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addCreateAliyunKmsSecretTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      instanceId: this.aliyunInstance.id,
      detail: {
        edsInstance: this.aliyunInstance,
        kmsInstance: this.kmsInstance,
        secretName: this.secretName,
        secretData: this.secretData,
        versionId: this.versionId,
        encryptionKeyId: this.encryptionKey.assetKey,
        description: this.description,
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

  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
}
