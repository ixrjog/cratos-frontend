import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableComponent, DialogService } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  ChannelAvailableStatusEnum,
  ChannelConstructionPhaseEnum,
  ChannelInfoEdit,
  ChannelInfoPageQuery,
  ChannelInfoVO,
  ChannelPriorityEnum,
} from '../../../../../@core/data/channel-info';
import { ChannelInfoService } from '../../../../../@core/services/channel-info.service';
import { ChannelInfoEditorComponent } from './channel-info-editor/channel-info-editor.component';
import { ChannelExtensionEditorComponent } from './channel-extension-editor/channel-extension-editor.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-channel-info-list-data-table',
  templateUrl: './channel-info-list-data-table.component.html',
  styleUrls: ['./channel-info-list-data-table.component.less'],
})
export class ChannelInfoListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    country: '',
  };
  table: Table<ChannelInfoVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  countryOptions: { label: string; value: string; count: number }[] = [];

  newChannel: ChannelInfoEdit = {
    name: '',
    monitorUrl: '',
    priority: ChannelPriorityEnum.MEDIUM,
    country: '',
    networkInfo: '',
    availableStatus: ChannelAvailableStatusEnum.DOWN,
    constructionPhase: ChannelConstructionPhaseEnum.PLANNING,
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: ChannelInfoEditorComponent,
      width: '60%',
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private channelInfoService: ChannelInfoService,
    private dialogUtil: DialogUtil,
    private dialogService: DialogService,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: ChannelInfoPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelInfoService.queryChannelPage(param));
  }

  ngOnInit() {
    this.fetchData();
    this.fetchCountryOptions();
  }

  fetchCountryOptions() {
    this.channelInfoService.getCountryOptions().subscribe(({ body }) => {
      this.countryOptions = (body.options || []).map(o => ({ label: o.label, value: o.value, count: o.comment }));
    });
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
      title: 'New Channel',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newChannel)));
  }

  onRowEdit(rowItem: ChannelInfoVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Channel',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: ChannelInfoVO) {
    this.channelInfoService.setChannelValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: ChannelInfoVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.channelInfoService.deleteChannelById({ id: rowItem.id })
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
        obList.push(this.channelInfoService.deleteChannelById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onCellEditEnd(event) {
    const param: ChannelInfoEdit = {
      id: event.rowItem.id,
      name: event.rowItem.name,
      monitorUrl: event.rowItem.monitorUrl,
      priority: event.rowItem.priority,
      country: event.rowItem.country,
      networkInfo: event.rowItem.networkInfo,
      availableStatus: event.rowItem.availableStatus,
      constructionPhase: event.rowItem.constructionPhase,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
    };
    this.channelInfoService.updateChannel(param)
      .pipe(
        catchError((error: any) => {
          this.fetchData();
          return new error();
        }),
      )
      .subscribe();
  }

  @ViewChild('networkInfoTemplate') networkInfoTemplate: TemplateRef<any>;
  networkInfoContent = '';

  onShowNetworkInfo(rowItem: ChannelInfoVO) {
    this.networkInfoContent = rowItem.networkInfo.replace(/<br\s*\/?>/gi, '\n\n');
    this.dialogService.open({
      id: 'network-info-dialog',
      width: '60%',
      maxHeight: '800px',
      backdropCloseable: true,
      dialogtype: 'standard',
      title: 'Network Info',
      contentTemplate: this.networkInfoTemplate,
      buttons: [],
    });
  }

  onRowAddExtension(rowItem: ChannelInfoVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Channel Extension',
      content: ChannelExtensionEditorComponent,
      width: '600px',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  protected readonly getRowColor = getRowColor;
}
