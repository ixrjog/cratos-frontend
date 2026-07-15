import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ChannelRouteConfigService } from '../../../../@core/services/channel-route-config.service';
import { ChannelRouteConfigPageQuery, ChannelRouteConfigVO } from '../../../../@core/data/channel-route-config';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import {
  ChannelRouteConfigEditorComponent
} from './channel-route-config-editor/channel-route-config-editor.component';

@Component({
  selector: 'app-channel-route-config-data-table',
  templateUrl: './channel-route-config-data-table.component.html',
  styleUrls: ['./channel-route-config-data-table.component.less'],
})
export class ChannelRouteConfigDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  private static readonly SEARCH_STORAGE_KEY = 'channel_route_config_search_query';

  queryParam = {
    queryName: localStorage.getItem(ChannelRouteConfigDataTableComponent.SEARCH_STORAGE_KEY) || '',
  };

  table: Table<ChannelRouteConfigVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '60%',
      content: ChannelRouteConfigEditorComponent,
    },
  };

  newConfig = {
    channelId: null,
    country: '',
    routeChannel: '',
    applicationId: null,
    instanceId: null,
    service: '',
    saveApi: '',
    queryApi: '',
    namespace: '',
    valid: true,
    comment: '',
  };

  constructor(private channelRouteConfigService: ChannelRouteConfigService, private dialogUtil: DialogUtil) {
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    localStorage.setItem(ChannelRouteConfigDataTableComponent.SEARCH_STORAGE_KEY, this.queryParam.queryName);
    const param: ChannelRouteConfigPageQuery = {
      queryName: this.queryParam.queryName,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelRouteConfigService.queryChannelRouteConfigPage(param));
  }

  onSearch() {
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Channel Route Config',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newConfig)));
  }

  onRowEdit(rowItem: ChannelRouteConfigVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Channel Route Config',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

}
