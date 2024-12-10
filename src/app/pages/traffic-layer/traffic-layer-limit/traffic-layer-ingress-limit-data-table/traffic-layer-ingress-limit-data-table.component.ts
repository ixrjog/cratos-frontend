import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { KubernetesResourceTemplatePageQuery } from '../../../../@core/data/kubernetes-resource';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import { TrafficLayerIngressTrafficLimitVO } from '../../../../@core/data/traffic-layer';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import {
  TrafficLayerIngressLimitEditorComponent,
} from './traffic-layer-ingress-limit-editor/traffic-layer-ingress-limit-editor.component';

@Component({
  selector: 'app-traffic-layer-ingress-limit-data-table',
  templateUrl: './traffic-layer-ingress-limit-data-table.component.html',
  styleUrls: [ './traffic-layer-ingress-limit-data-table.component.less' ],
})
export class TrafficLayerIngressLimitDataTableComponent implements OnInit {

  queryParam = {
    queryName: '',
  };

  table: Table<TrafficLayerIngressTrafficLimitVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: TrafficLayerIngressLimitEditorComponent,
    },
  };

  constructor(
    private trafficLayerService: TrafficLayerService,
    private dialogUtil: DialogUtil,
  ) {
  }

  fetchData() {
    const param: KubernetesResourceTemplatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.trafficLayerService.queryIngressTrafficLimitPage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  onRowEdit(rowItem: TrafficLayerIngressTrafficLimitVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Ingress Traffic Limit',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

}
