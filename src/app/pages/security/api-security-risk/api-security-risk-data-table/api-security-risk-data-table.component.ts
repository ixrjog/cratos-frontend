import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ApiSecurityRiskService } from '../../../../@core/services/api-security-risk.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { ApiSecurityRiskEditorComponent } from './api-security-risk-editor/api-security-risk-editor.component';
import { ActivatedRoute } from '@angular/router';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-api-security-risk-data-table',
  templateUrl: './api-security-risk-data-table.component.html',
  styleUrls: ['./api-security-risk-data-table.component.less'],
})
export class ApiSecurityRiskDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  queryParam = {
    queryName: '',
    riskNo: '',
  };

  table: Table<any> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: ApiSecurityRiskEditorComponent,
    },
  };

  newRisk = {
    riskNo: '',
    riskDescription: '',
    apiEndpoint: '',
    docUrl: '',
    riskLevel: 'MEDIUM',
    analyst: '',
    securityOfficer: '',
    contactPerson: '',
    followUpGroup: '',
    progress: 'PENDING',
    analysisDesc: '',
    discoveredTime: new Date(),
    expectedTime: null,
    comment: '',
  };

  constructor(
    private apiSecurityRiskService: ApiSecurityRiskService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
  ) {
  }

  fetchData() {
    const param = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.apiSecurityRiskService.queryRiskPage(param));
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['riskNo']) {
        this.queryParam.riskNo = params['riskNo'];
      }
    });
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: this.translate.instant('apiSecurityRisk.dialog.newTitle'),
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newRisk)));
  }

  onRowEdit(rowItem: any) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: this.translate.instant('apiSecurityRisk.dialog.editTitle'),
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      ...rowItem,
      discoveredTime: rowItem.discoveredTime ? new Date(rowItem.discoveredTime) : null,
      expectedTime: rowItem.expectedTime ? new Date(rowItem.expectedTime) : null,
    });
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  getRiskLevelStyle(level: string): string {
    switch (level) {
      case 'CRITICAL': return 'red-w98';
      case 'HIGH': return 'red-w98';
      case 'MEDIUM': return 'orange-w98';
      case 'LOW': return 'blue-w98';
      default: return 'default';
    }
  }

  onRowDelete(rowItem: any) {
    const dialogDate = {
      ...DIALOG_DATA.warningOperateData,
      content: this.translate.instant('apiSecurityRisk.dialog.deleteConfirm'),
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.apiSecurityRiskService.deleteRiskById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  popoverStyle = { background: 'var(--devui-connected-overlay-bg, #fff)', border: '1px solid var(--devui-dividing-line, #dfe1e6)' };

  getProgressStyle(progress: string): string {
    switch (progress) {
      case 'FIXED': return 'green-w98';
      case 'CONFIRMED': return 'blue-w98';
      case 'CONFIRMING': return 'orange-w98';
      case 'PENDING': return 'red-w98';
      default: return 'default';
    }
  }

}
