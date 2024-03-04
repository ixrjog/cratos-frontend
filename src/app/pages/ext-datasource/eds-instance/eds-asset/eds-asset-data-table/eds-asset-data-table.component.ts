import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/utils/data.util';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { AssetPageQuery, EdsAssetVO } from '../../../../../@core/data/ext-datasource';

@Component({
  selector: 'app-eds-asset-data-table',
  templateUrl: './eds-asset-data-table.component.html',
  styleUrls: [ './eds-asset-data-table.component.less' ],
})
export class EdsAssetDataTableComponent implements OnChanges {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;

  @Input() instanceId: number;
  @Input() assetType: string;
  @Input() currentType: string;

  queryParam = {
    queryName: '',
    valid: null,
  };

  limit = RELATIVE_TIME_LIMIT;

  table: Table<EdsAssetVO> = {
    ...TABLE_DATA,
  };

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
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentType']?.currentValue === changes['assetType']?.currentValue) {
      this.fetchData();
    }
  }

  fetchData() {
    const param: AssetPageQuery = {
      ...this.queryParam,
      instanceId: this.instanceId,
      assetType: this.assetType,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.edsService.queryEdsInstanceAssetPage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onRowDelete(rowItem: EdsAssetVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.edsService.deleteEdsInstanceAssetById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowValid(rowItem: EdsAssetVO) {
    this.edsService.setEdsInstanceAssetValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
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
        obList.push(this.edsService.deleteEdsInstanceAssetById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
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
        obList.push(this.edsService.setEdsInstanceAssetValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
    });
  }

  protected readonly getRowColor = getRowColor;

}
