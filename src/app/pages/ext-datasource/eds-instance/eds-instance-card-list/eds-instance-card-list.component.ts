import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { Table } from '../../../../@core/data/base-data';
import { EdsConfigVO, EdsInstanceVO, InstancePageQuery } from '../../../../@core/data/ext-datasource';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import {
  EdsConfigEditorComponent,
} from '../../eds-config/eds-config-data-table/eds-config-editor/eds-config-editor.component';
import { EdsInstanceEditorComponent } from './eds-instance-editor/eds-instance-editor.component';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { ChannelNetworkVO } from '../../../../@core/data/channel-network';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';

@Component({
  selector: 'app-eds-instance-card-list',
  templateUrl: './eds-instance-card-list.component.html',
  styleUrls: [ './eds-instance-card-list.component.less' ],
})
export class EdsInstanceCardListComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    edsType: '',
  };
  businessType: string = BusinessTypeEnum.EDS_INSTANCE;

  edsTypeOptions = [];

  table: Table<EdsInstanceVO> = {
    loading: false,
    data: [],
    pager: {
      pageIndex: 1,
      pageSize: 9,
      total: 0,
    },
  };

  constructor(private edsService: EdsService) {
  }

  fetchData() {
    const param: InstancePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.edsService.queryEdsInstancePage(param));
  }

  getEdsTypeOptions() {
    this.edsService.getEdsInstanceTypeOptions()
      .subscribe(({ body }) => {
        this.edsTypeOptions = body.options;
      });
  };

  ngOnInit() {
    this.fetchData();
    this.getEdsTypeOptions();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}
