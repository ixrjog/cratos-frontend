import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { AssetMaturityEdit, AssetMaturityPageQuery, AssetMaturityVO } from '../../../../@core/data/asset-maturity';
import { AssetMaturityEditorComponent } from './asset-maturity-editor/asset-maturity-editor.component';
import { AssetMaturityService } from '../../../../@core/services/asset-maturity.service';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';

@Component({
  selector: 'app-asset-maturity-data-table',
  templateUrl: './asset-maturity-data-table.component.html',
  styleUrls: [ './asset-maturity-data-table.component.less' ],
})
export class AssetMaturityDataTableComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };
  limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.ASSET_MATURITY;

  table: Table<AssetMaturityVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newAssetMaturity: AssetMaturityEdit = {
    autoRenewal: false,
    itemType: '',
    subscriptionTime: null,
    expiry: Date.now(),
    name: '',
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: AssetMaturityEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };
  protected readonly getRowColor = getRowColor;

  constructor(
    private assetMaturityService: AssetMaturityService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: AssetMaturityPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.assetMaturityService.queryAssetMaturityPage(param));
  }

  ngOnInit() {
    setTimeout(() => {
      this.businessCascader.getTagOptions();
    }, 500);
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
      title: 'New Asset Maturity',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newAssetMaturity)));
  }

  onRowEdit(rowItem: AssetMaturityVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Asset Maturity',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      ...rowItem,
      expiry: rowItem.expiry ? new Date(rowItem.expiry) : Date.now(),
      subscriptionTime: rowItem.subscriptionTime ? new Date(rowItem.subscriptionTime) : null,
    });
  }

  onRowValid(rowItem: AssetMaturityVO) {
    this.assetMaturityService.setAssetMaturityValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: AssetMaturityVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.assetMaturityService.deleteAssetMaturityById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
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
        obList.push(this.assetMaturityService.setAssetMaturityValidById({ id: row.id }));
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
        obList.push(this.assetMaturityService.deleteAssetMaturityById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: AssetMaturityVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: AssetMaturityVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

}

