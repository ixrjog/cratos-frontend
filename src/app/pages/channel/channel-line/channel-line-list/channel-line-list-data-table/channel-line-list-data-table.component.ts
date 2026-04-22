import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { ChannelLineEdit, ChannelLinePageQuery, ChannelLineVO } from '../../../../../@core/data/channel-line';
import { ChannelLineService } from '../../../../../@core/services/channel-line.service';
import { ChannelInfoService } from '../../../../../@core/services/channel-info.service';
import { ChannelLineEditorComponent } from './channel-line-editor/channel-line-editor.component';

@Component({
  selector: 'app-channel-line-list-data-table',
  templateUrl: './channel-line-list-data-table.component.html',
  styleUrls: ['./channel-line-list-data-table.component.less'],
})
export class ChannelLineListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    channelId: null as number,
  };
  table: Table<ChannelLineVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  channelOptions: { label: string; value: number }[] = [];
  selectedChannel: any = null;

  newChannelLine: ChannelLineEdit = {
    channelId: null,
    name: '',
    lineType: '',
    sourceEndpoint: '',
    monitorUrl: '',
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: { ...DIALOG_DATA.editorData, content: ChannelLineEditorComponent },
    warningOperateData: { ...DIALOG_DATA.warningOperateData },
    content: { ...DIALOG_DATA.content },
  };

  constructor(
    private channelLineService: ChannelLineService,
    private channelInfoService: ChannelInfoService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {}

  fetchData() {
    const param: ChannelLinePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelLineService.queryChannelLinePage(param));
  }

  ngOnInit() {
    this.fetchChannels();
    this.fetchData();
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: '', page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.channelOptions = (body.data || []).map(c => ({ label: c.name, value: c.id }));
      });
  }

  onChannelChange(selected: any) {
    this.queryParam.channelId = selected?.value || null;
    this.fetchData();
  }

  pageIndexChange(p) { this.table.pager.pageIndex = p; this.fetchData(); }
  pageSizeChange(s) { this.table.pager.pageSize = s; this.fetchData(); }

  onRowNew() {
    const newData = JSON.parse(JSON.stringify(this.newChannelLine));
    if (this.selectedChannel) {
      newData.channelId = this.selectedChannel.value;
      newData.channelName = this.selectedChannel.label;
    }
    this.dialogUtil.onEditDialog(ADD_OPERATION, { ...this.dialogDate.editorData, title: 'New Channel Line' }, () => this.fetchData(), newData);
  }

  onRowEdit(rowItem: ChannelLineVO) {
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, { ...this.dialogDate.editorData, title: 'Edit Channel Line' }, () => this.fetchData(), rowItem);
  }

  onRowValid(rowItem: ChannelLineVO) {
    this.channelLineService.setChannelLineValidById({ id: rowItem.id }).subscribe(() => this.fetchData());
  }

  onRowDelete(rowItem: ChannelLineVO) {
    this.dialogUtil.onDialog({ ...this.dialogDate.warningOperateData, content: this.dialogDate.content.delete }, () => {
      this.channelLineService.deleteChannelLineById({ id: rowItem.id }).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        this.fetchData();
      });
    });
  }

  onBatchDelete() {
    this.dialogUtil.onDialog({ ...this.dialogDate.warningOperateData, content: this.dialogDate.content.batchDelete }, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => obList.push(this.channelLineService.deleteChannelLineById({ id: row.id })));
      zip(obList).subscribe(() => { this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE); this.fetchData(); });
    });
  }

  protected readonly getRowColor = getRowColor;
}
