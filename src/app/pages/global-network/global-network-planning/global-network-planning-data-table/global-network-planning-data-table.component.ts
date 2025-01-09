import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import {
  GlobalNetworkPlanningEdit,
  GlobalNetworkPlanningPageQuery,
  GlobalNetworkPlanningVO,
  GlobalNetworkVO,
} from '../../../../@core/data/global-network';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { GlobalNetworkService } from '../../../../@core/services/global-network.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  GlobalNetworkPlanningEditorComponent,
} from './global-network-planning-editor/global-network-planning-editor.component';
import { TrafficLayerDomainPageQuery } from '../../../../@core/data/traffic-layer';
import { map } from 'rxjs/operators';
import {
  BusinessCascaderComponent,
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-global-network-planning-data-table',
  templateUrl: './global-network-planning-data-table.component.html',
  styleUrls: [ './global-network-planning-data-table.component.less' ],
})
export class GlobalNetworkPlanningDataTableComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    networkId: null,
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };
  protected readonly limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.GLOBAL_NETWORK_PLANNING;
  network: GlobalNetworkVO;

  table: Table<GlobalNetworkPlanningVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newGlobalNetworkPlanning: GlobalNetworkPlanningEdit = {
    networkId: null,
    cidrBlock: '',
    resourceTotal: 0,
    name: '',
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: GlobalNetworkPlanningEditorComponent,
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
    const param: GlobalNetworkPlanningPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.globalNetworkService.queryGlobalNetworkPlanningPage(param));
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
      title: 'New Global Network Planning',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newGlobalNetworkPlanning)));
  }

  onRowEdit(rowItem: GlobalNetworkPlanningVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Global Network Planning',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: GlobalNetworkPlanningVO) {
    this.globalNetworkService.setGlobalNetworkPlanningValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: GlobalNetworkPlanningVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.globalNetworkService.deleteGlobalNetworkPlanningById({ id: rowItem.id })
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
        obList.push(this.globalNetworkService.setGlobalNetworkPlanningValidById({ id: row.id }));
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
        obList.push(this.globalNetworkService.deleteGlobalNetworkPlanningById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: GlobalNetworkPlanningVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: GlobalNetworkPlanningVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  onSearchNetwork = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.globalNetworkService.queryGlobalNetworkPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((network, index) => ({ id: index, option: network })),
        ),
      );
  };

  onNetworkChange(network: GlobalNetworkVO) {
    this.queryParam.networkId = network?.id;
  }

}
