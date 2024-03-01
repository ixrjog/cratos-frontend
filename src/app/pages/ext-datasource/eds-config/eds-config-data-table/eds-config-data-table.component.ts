import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ChannelNetworkVO } from '../../../../@core/data/channel-network';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { finalize, Observable, zip } from 'rxjs';
import {
  EdsConfigEdit,
  EdsConfigPageQuery,
  EdsConfigVO,
  RegisterInstance,
} from '../../../../@core/data/ext-datasource';
import { EdsConfigEditorComponent } from './eds-config-editor/eds-config-editor.component';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import {
  EdsInstanceEditorComponent
} from '../../eds-instance/eds-instance-card-list/eds-instance-editor/eds-instance-editor.component';

@Component({
  selector: 'app-eds-config-data-table',
  templateUrl: './eds-config-data-table.component.html',
  styleUrls: [ './eds-config-data-table.component.less' ],
})
export class EdsConfigDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    edsType: '',
    valid: null,
  };
  businessType: string = BusinessTypeEnum.EDS_CONFIG;

  table: Table<EdsConfigVO> = {
    ...TABLE_DATA,
  };

  newEdsConfig: EdsConfigEdit = {
    comment: '',
    configContent: '',
    credentialId: null,
    edsType: '',
    name: '',
    url: '',
    version: '',
    valid: true,
  };

  registerEdsInstance: RegisterInstance = {
    comment: '',
    configId: 0,
    instanceName: '',
    kind: '',
    url: '',
    valid: true,
    version: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: EdsConfigEditorComponent,
    },
    editorInstanceData: {
      ...DIALOG_DATA.editorData,
      content: EdsInstanceEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsService: EdsService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: EdsConfigPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.edsService.queryEdsConfigPage(param));
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
      title: 'New Eds Config',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newEdsConfig);
  }

  onRowEdit(rowItem: EdsConfigVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Eds Config',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: EdsConfigVO) {
    this.edsService.setEdsConfigValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: EdsConfigVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.edsService.deleteEdsConfigById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  OnRowRegister(rowItem: EdsConfigVO) {
    const dialogDate = {
      ...this.dialogDate.editorInstanceData,
      title: 'Register Eds Instance',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      ...this.registerEdsInstance,
      configId: rowItem.id,
      edsType: rowItem.edsType,
    });
  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchValid,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.edsService.setEdsConfigValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
    });
  }

  onBatchDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchDelete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.edsService.deleteEdsConfigById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: EdsConfigVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: EdsConfigVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onCellEditEnd(event) {
    const param: EdsConfigEdit = {
      id: event.rowItem.id,
      name: event.rowItem.name,
      credentialId: event.rowItem.credentialId,
      configContent: event.rowItem.configContent,
      edsType: event.rowItem.edsType,
      url: event.rowItem.url,
      comment: event.rowItem.comment,
      version: event.rowItem.version,
      valid: event.rowItem.valid,
    };
    this.edsService.updateEdsConfig(param)
      .pipe(
        finalize(() => this.fetchData()),
      ).subscribe();
  }

  protected readonly getRowColor = getRowColor;
  protected readonly limit = RELATIVE_TIME_LIMIT;
}

