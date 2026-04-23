import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AcmeDomainPageQuery, AcmeDomainVO, AcmeService } from '../../../../@core/services/acme.service';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { countResource, parseResourceCount } from '../../../../@shared/utils/resource-count.util';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { DialogService } from 'ng-devui';
import { AcmeDomainEditorComponent } from './acme-domain-editor/acme-domain-editor.component';
import { AcmeDomainIssueConfirmComponent } from './acme-domain-issue-confirm/acme-domain-issue-confirm.component';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-acme-domain-data-table',
  templateUrl: './acme-domain-data-table.component.html',
  styleUrls: ['./acme-domain-data-table.component.less'],
})
export class AcmeDomainDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;
  protected readonly countResource = countResource;
  protected readonly parseResourceCount = parseResourceCount;
  businessType: string = BusinessTypeEnum.ACME_DOMAIN;

  queryParam = {
    queryName: '',
  };

  table: Table<AcmeDomainVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: AcmeDomainEditorComponent,
    },
  };

  newDomain = {
    name: '--',
    domain: '',
    domains: '',
    zoneId: '',
    dnsResolverInstanceId: null,
    accountId: null,
    dcvType: '',
    dcvDelegationTarget: '',
    valid: true,
    comment: '',
  };

  constructor(private acmeService: AcmeService, private dialogUtil: DialogUtil, private dialogService: DialogService, private toastUtil: ToastUtil) {
  }

  fetchData() {
    const param: AcmeDomainPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.acmeService.queryAcmeDomainPage(param));
  }

  ngOnInit() {
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New ACME Domain',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newDomain)));
  }

  onRowEdit(rowItem: AcmeDomainVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit ACME Domain',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  onIssueCertificate(rowItem: AcmeDomainVO) {
    const results = this.dialogService.open({
      id: 'issue-certificate',
      title: 'Issue Certificate',
      width: '500px',
      maxHeight: '600px',
      backdropCloseable: true,
      dialogtype: 'standard',
      content: AcmeDomainIssueConfirmComponent,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Confirm',
          handler: () => {
            this.acmeService.issueCertificate({ acmeDomainId: rowItem.id })
              .subscribe({
                next: () => {
                  this.toastUtil.onSuccessToast('Certificate issuance started');
                  results.modalInstance.hide();
                },
                error: (err) => {
                  this.toastUtil.onErrorToast(err?.error?.desc || 'Issue certificate failed');
                },
              });
          },
        },
        {
          cssClass: 'common',
          text: 'Cancel',
          handler: () => results.modalInstance.hide(),
        },
      ],
      data: {
        formData: rowItem,
      },
    });
  }

  onRecoverDcv(rowItem: AcmeDomainVO) {
    this.acmeService.recoverDcvDelegation({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
        this.fetchData();
      });
  }

}
