import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BusinessCascaderComponent,
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  TrafficRecordTargetEdit,
  TrafficRouteEdit,
  TrafficRoutePageQuery,
  TrafficRouteVO,
} from '../../../../@core/data/traffic-route';
import { TrafficLayerRouteEditorComponent } from './traffic-layer-route-editor/traffic-layer-route-editor.component';
import { TrafficRouteService } from '../../../../@core/services/traffic-route.service';
import { getPopoverStyle } from '../../../../@shared/utils/theme.util';
import {
  TrafficLayerRouteRecordTargetEditorComponent,
} from './traffic-layer-route-record-target-editor/traffic-layer-route-record-target-editor.component';
import {
  TrafficLayerRouteRecordTargetSwitchComponent,
} from './traffic-layer-route-record-target-switch/traffic-layer-route-record-target-switch.component';
import { DRAWER_DATA, DrawerUtil } from '../../../../@shared/utils/drawer.util';

@Component({
  selector: 'app-traffic-layer-route-data-table',
  templateUrl: './traffic-layer-route-data-table.component.html',
  styleUrls: [ './traffic-layer-route-data-table.component.less' ],
})
export class TrafficLayerRouteDataTableComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  businessType: string = BusinessTypeEnum.TRAFFIC_ROUTE;

  queryParam = {
    queryName: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  table: Table<TrafficRouteVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    switchTargetData: {
      ...DIALOG_DATA.editorData,
      content: TrafficLayerRouteRecordTargetSwitchComponent,
    },
    editorData: {
      ...DIALOG_DATA.editorData,
      content: TrafficLayerRouteEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  drawerDate = {
    editTargetData: {
      ...DRAWER_DATA.editorData,
      width: '70%',
      drawerContentComponent: TrafficLayerRouteRecordTargetEditorComponent,
    },
  };

  newTrafficRoute: TrafficRouteEdit = {
    domainId: null,
    domainRecordId: null,
    domain: '',
    domainRecord: '',
    dnsResolverInstanceId: null,
    comment: '',
    valid: true,
  };
  protected readonly getRowColor = getRowColor;

  constructor(
    private trafficRouteService: TrafficRouteService,
    private dialogUtil: DialogUtil,
    private drawerUtil: DrawerUtil,
    private toastUtil: ToastUtil) {
  }

  fetchData() {
    const param: TrafficRoutePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.trafficRouteService.queryTrafficRoutePage(param));
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
      title: 'New Traffic Layer Route',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newTrafficRoute)));
  }

  onRowEdit(rowItem: TrafficRouteVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Traffic Layer Route',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowEditTarget(rowItem: TrafficRouteVO) {
    const formData: TrafficRecordTargetEdit = {
      trafficRouteId: rowItem.id,
      resourceRecord: '',
      recordValue: '',
      recordType: '',
      targetType: '',
      origin: false,
      ttl: 300,
      comment: '',
      valid: true,
    };
    const drawerDate = {
      ...this.drawerDate.editTargetData,
    };
    this.drawerUtil.onDrawer(drawerDate, formData, () => this.fetchData(), { trafficRoute: rowItem });
  }

  onRowSwitchTarget(rowItem: TrafficRouteVO) {
    const dialogDate = {
      ...this.dialogDate.switchTargetData,
      title: 'Switch Traffic Layer Route Target',
    };
    this.dialogUtil.onEditWithoutButtonDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: TrafficRouteVO) {
    this.trafficRouteService.setTrafficRouteValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: TrafficRouteVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.trafficRouteService.deleteTrafficRouteById({ id: rowItem.id })
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
        obList.push(this.trafficRouteService.setTrafficRouteValidById({ id: row.id }));
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
        obList.push(this.trafficRouteService.deleteTrafficRouteById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: TrafficRouteVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onBatchTag() {
    this.dialogUtil.onBusinessTagBatchEditDialog(
      this.businessType, this.datatable.getCheckedRows(), () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: TrafficRouteVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  protected readonly getPopoverStyle = getPopoverStyle;
}
