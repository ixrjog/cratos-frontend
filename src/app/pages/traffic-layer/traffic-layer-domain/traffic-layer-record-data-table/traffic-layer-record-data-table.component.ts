import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordEdit,
  TrafficLayerRecordPageQuery,
  TrafficLayerRecordVO,
} from '../../../../@core/data/traffic-layer';
import { TrafficLayerRecordEditorComponent } from './traffic-layer-record-editor/traffic-layer-record-editor.component';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { EnvService } from '../../../../@core/services/env.service';
import { EnvPageQuery } from '../../../../@core/data/env';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-traffic-layer-record-data-table',
  templateUrl: './traffic-layer-record-data-table.component.html',
  styleUrls: [ './traffic-layer-record-data-table.component.less' ],
})
export class TrafficLayerRecordDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  businessType: string = BusinessTypeEnum.TRAFFIC_LAYER_RECORD;
  queryParam = {
    queryName: '',
    domainId: null,
  };
  trafficLayerDomain: TrafficLayerDomainVO;
  envOptions = [];

  table: Table<TrafficLayerRecordVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newTrafficLayerRecord: TrafficLayerRecordEdit = {
    domainId: null,
    envName: null,
    recordName: null,
    routeTrafficTo: null,
    originServer: null,
    comment: '',
    valid: true,
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: TrafficLayerRecordEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private trafficLayerService: TrafficLayerService,
    private envService: EnvService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  getEnvOptions() {
    const param: EnvPageQuery = {
      length: 20, page: 1, queryName: '',

    };
    this.envService.queryEnvPage(param)
      .subscribe(({ body }) => this.envOptions = body.data);
  }

  fetchData() {
    const param: TrafficLayerRecordPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.trafficLayerService.queryTrafficLayerRecordPage(param));
  }

  onCellEditEnd(event) {
    const param: TrafficLayerRecordEdit = {
      id: event.rowItem.id,
      domainId: event.rowItem.domainId,
      envName: event.rowItem.envName,
      recordName: event.rowItem.recordName,
      routeTrafficTo: event.rowItem.routeTrafficTo,
      originServer: event.rowItem.originServer,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
    };
    this.trafficLayerService.updateTrafficLayerRecord(param)
      .pipe(
        catchError((error: any) => {
          this.fetchData();
          return new error();
        }),
      )
      .subscribe();
  }

  finishEdit() {
    this.datatable.cancelEditingStatus();
  }

  ngOnInit() {
    this.getEnvOptions();
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
      title: 'New Traffic Layer Record',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newTrafficLayerRecord)), { trafficLayerDomain: this.trafficLayerDomain });
  }

  onRowValid(rowItem: TrafficLayerRecordVO) {
    this.trafficLayerService.setTrafficLayerRecordValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: TrafficLayerRecordVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.trafficLayerService.deleteTrafficLayerRecord({ id: rowItem.id })
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
        obList.push(this.trafficLayerService.setTrafficLayerRecordValidById({ id: row.id }));
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
        obList.push(this.trafficLayerService.deleteTrafficLayerRecord({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: TrafficLayerRecordVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: TrafficLayerRecordVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onSearchTrafficLayerDomain = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.trafficLayerService.queryTrafficLayerDomainPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((group, index) => ({ id: index, option: group })),
        ),
      );
  };

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.queryParam.domainId = domainVO.id;
  }

  protected readonly getRowColor = getRowColor;
}
