import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { finalize, Observable, zip } from 'rxjs';
import {
  ChannelAvailableStatusEnum,
  ChannelNetworkEdit,
  ChannelNetworkPageQuery,
  ChannelNetworkVO,
} from '../../../../@core/data/channel-network';
import { ChannelNetworkEditorComponent } from './channel-network-editor/channel-network-editor.component';
import { ChannelNetworkService } from '../../../../@core/services/channel-network.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-channel-network-list-data-table',
  templateUrl: './channel-network-list-data-table.component.html',
  styleUrls: [ './channel-network-list-data-table.component.less' ],
})
export class ChannelNetworkListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
  };
  businessType: string = BusinessTypeEnum.CHANNEL_NETWORK;

  table: Table<ChannelNetworkVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newChannelNetwork: ChannelNetworkEdit = {
    availableStatus: '',
    channelKey: '',
    channelStatus: ChannelAvailableStatusEnum.DOWN,
    comment: '',
    name: '',
    valid: true,
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: ChannelNetworkEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private channelNetworkService: ChannelNetworkService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: ChannelNetworkPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelNetworkService.queryChannelNetworkPage(param));
  }

  ngOnInit() {
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
      title: 'New Channel Network',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newChannelNetwork)));
  }

  onRowEdit(rowItem: ChannelNetworkVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Channel Network',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: ChannelNetworkVO) {
    this.channelNetworkService.setChannelNetworkValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: ChannelNetworkVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.channelNetworkService.deleteChannelNetworkById({ id: rowItem.id })
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
        obList.push(this.channelNetworkService.setChannelNetworkValidById({ id: row.id }));
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
        obList.push(this.channelNetworkService.deleteChannelNetworkById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: ChannelNetworkVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: ChannelNetworkVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onCellEditEnd(event) {
    const param: ChannelNetworkEdit = {
      id: event.rowItem.id,
      name: event.rowItem.name,
      channelKey: event.rowItem.channelKey,
      channelStatus: event.rowItem.channelStatus,
      availableStatus: event.rowItem.availableStatus,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
    };
    this.channelNetworkService.updateChannelNetwork(param)
      .pipe(
        catchError((error: any) => {
          this.fetchData();
          return new error();
        }),
      )
      .subscribe();
  }

  protected readonly getRowColor = getRowColor;
}
