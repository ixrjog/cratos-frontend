import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  BusinessDirectionEnum,
  ChannelBusinessEdit,
  ChannelBusinessPageQuery,
  ChannelBusinessVO,
} from '../../../../../@core/data/channel-business';
import { ChannelBusinessService } from '../../../../../@core/services/channel-business.service';
import { ChannelInfoService } from '../../../../../@core/services/channel-info.service';
import { ChannelBusinessEditorComponent } from './channel-business-editor/channel-business-editor.component';
import { ChannelBusinessLineEditorComponent } from './channel-business-line-editor/channel-business-line-editor.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-channel-business-list-data-table',
  templateUrl: './channel-business-list-data-table.component.html',
  styleUrls: ['./channel-business-list-data-table.component.less'],
})
export class ChannelBusinessListDataTableComponent implements OnInit {

  static readonly CHANNEL_STORAGE_KEY = 'channel_business_channel';

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    channelId: null as number,
  };
  table: Table<ChannelBusinessVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  channelOptions: { label: string; value: number }[] = [];
  selectedChannel: any = null;

  newChannelBusiness: ChannelBusinessEdit = {
    organizationId: null,
    channelId: null,
    businessName: '',
    type: 'WITHDRAWAL',
    businessDirection: BusinessDirectionEnum.OUTBOUND,
    valid: true,
    seq: 0,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: ChannelBusinessEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private channelBusinessService: ChannelBusinessService,
    private channelInfoService: ChannelInfoService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: ChannelBusinessPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelBusinessService.queryChannelBusinessPage(param));
  }

  ngOnInit() {
    this.fetchChannels();
    this.fetchData();
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: '', page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.channelOptions = (body.data || []).map(c => ({ label: c.name, value: c.id }));
        const saved = localStorage.getItem(ChannelBusinessListDataTableComponent.CHANNEL_STORAGE_KEY);
        if (saved) {
          try {
            const ch = JSON.parse(saved);
            const match = this.channelOptions.find(o => o.value === ch.value);
            if (match) {
              this.selectedChannel = match;
              this.queryParam.channelId = match.value;
              this.fetchData();
            }
          } catch (e) {}
        }
      });
  }

  onChannelChange(selected: any) {
    this.queryParam.channelId = selected?.value || null;
    if (selected) {
      localStorage.setItem(ChannelBusinessListDataTableComponent.CHANNEL_STORAGE_KEY, JSON.stringify(selected));
    } else {
      localStorage.removeItem(ChannelBusinessListDataTableComponent.CHANNEL_STORAGE_KEY);
    }
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
    const newData = JSON.parse(JSON.stringify(this.newChannelBusiness));
    if (this.selectedChannel) {
      newData.channelId = this.selectedChannel.value;
      newData.channelName = this.selectedChannel.label;
    }
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Channel Business',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, newData);
  }

  onRowEdit(rowItem: ChannelBusinessVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Channel Business',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: ChannelBusinessVO) {
    this.channelBusinessService.setChannelBusinessValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: ChannelBusinessVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.channelBusinessService.deleteChannelBusinessById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
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
        obList.push(this.channelBusinessService.deleteChannelBusinessById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  protected readonly getRowColor = getRowColor;

  onRowManageLines(rowItem: ChannelBusinessVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Manage Lines',
      content: ChannelBusinessLineEditorComponent,
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => this.fetchData(), rowItem);
  }
}
