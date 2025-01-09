import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  GlobalNetworkSubnetEdit,
  GlobalNetworkSubnetPageQuery,
  GlobalNetworkSubnetVO,
} from '../../../../@core/data/global-network';
import {
  GlobalNetworkSubnetEditorComponent,
} from './global-network-subnet-editor/global-network-subnet-editor.component';
import { GlobalNetworkService } from '../../../../@core/services/global-network.service';
import {
  BusinessCascaderComponent,
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-global-network-subnet-data-table',
  templateUrl: './global-network-subnet-data-table.component.html',
  styleUrls: [ './global-network-subnet-data-table.component.less' ],
})
export class GlobalNetworkSubnetDataTableComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };
  protected readonly limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.GLOBAL_NETWORK_SUBNET;
  table: Table<GlobalNetworkSubnetVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  newGlobalNetworkSubnet: GlobalNetworkSubnetEdit = {
    mainName: '',
    mainType: '',
    mainId: null,
    region: '',
    subnetKey: '',
    zone: '',
    cidrBlock: '',
    resourceTotal: 0,
    name: '',
    valid: true,
    comment: ''
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      maxHeight: '800px',
      content: GlobalNetworkSubnetEditorComponent,
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
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: GlobalNetworkSubnetPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.globalNetworkService.queryGlobalNetworkSubnetPage(param));
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
      title: 'New Global Network Subnet',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newGlobalNetworkSubnet)));
  }

  onRowEdit(rowItem: GlobalNetworkSubnetVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Global Network Subnet',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: GlobalNetworkSubnetVO) {
    this.globalNetworkService.setGlobalNetworkSubnetValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: GlobalNetworkSubnetVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.globalNetworkService.deleteGlobalNetworkSubnetById({ id: rowItem.id })
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
        obList.push(this.globalNetworkService.setGlobalNetworkSubnetValidById({ id: row.id }));
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
        obList.push(this.globalNetworkService.deleteGlobalNetworkSubnetById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: GlobalNetworkSubnetVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: GlobalNetworkSubnetVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

}
