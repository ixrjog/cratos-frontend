import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { GlobalNetworkEdit, GlobalNetworkPageQuery, GlobalNetworkVO } from '../../../../@core/data/global-network';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { GlobalNetworkService } from '../../../../@core/services/global-network.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { GlobalNetworkEditorComponent } from './global-network-editor/global-network-editor.component';
import { Router } from '@angular/router';
import { GlobalNetworkCheckCidrComponent } from './global-network-check-cidr/global-network-check-cidr.component';
import { DialogService } from 'ng-devui/modal';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';

@Component({
  selector: 'app-global-network-data-table',
  templateUrl: './global-network-data-table.component.html',
  styleUrls: [ './global-network-data-table.component.less' ],
})
export class GlobalNetworkDataTableComponent implements OnInit {

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
  businessType: string = BusinessTypeEnum.GLOBAL_NETWORK;

  table: Table<GlobalNetworkVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newGlobalNetwork: GlobalNetworkEdit = {
    mainName: '',
    cidrBlock: '',
    resourceTotal: 0,
    name: '',
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: GlobalNetworkEditorComponent,
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
    private globalNetworkService: GlobalNetworkService,
    private dialogUtil: DialogUtil,
    private dialogService: DialogService,
    private toastUtil: ToastUtil,
    private route: Router,
  ) {
  }

  fetchData() {
    const param: GlobalNetworkPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.globalNetworkService.queryGlobalNetworkPage(param));
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
      title: 'New Global Network',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newGlobalNetwork)));
  }

  onRowEdit(rowItem: GlobalNetworkVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Global Network',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: GlobalNetworkVO) {
    this.globalNetworkService.setGlobalNetworkValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: GlobalNetworkVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.globalNetworkService.deleteGlobalNetworkById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRouteGlobalNetworkDetails(rowItem: GlobalNetworkVO) {
    this.route.navigate([ '/pages/global-network/details' ], { queryParams: { networkId: rowItem.id } });
  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchValid,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.globalNetworkService.setGlobalNetworkValidById({ id: row.id }));
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
        obList.push(this.globalNetworkService.deleteGlobalNetworkById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: GlobalNetworkVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: GlobalNetworkVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  onCheckCidrBlock(rowItem: GlobalNetworkVO) {
    this.globalNetworkService.checkGlobalNetworkById({ id: rowItem.id })
      .subscribe(({ body }) => {
        if (JSON.stringify(body) === '[]') {
          return;
        }
        const config = {
          id: 'check-cidr-block',
          width: '346px',
          maxHeight: '800px',
          dialogtype: 'warning',
          showAnimation: true,
          content: GlobalNetworkCheckCidrComponent,
          backdropCloseable: true,
          data: { globalNetworkList: body },
        };
        this.dialogService.open({
          ...config,
          buttons: [],
        });
      });
  }

}
