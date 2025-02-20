import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent, ICategorySearchTagItem } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { CommandExecEditorComponent } from './command-exec-editor/command-exec-editor.component';
import { CommandService } from '../../../../@core/services/command.service';
import { AddCommandExec, CommandExecPageQuery, CommandExecVO } from '../../../../@core/data/command';
import { CommandExecApproveComponent } from './command-exec-approve/command-exec-approve.component';
import { CommandExecDoComponent } from './command-exec-do/command-exec-do.component';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-command-exec-data-table',
  templateUrl: './command-exec-data-table.component.html',
  styleUrls: [ './command-exec-data-table.component.less' ],
})
export class CommandExecDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    namespace: '',
    completed: null,
    applyUsername: '',
    approvedBy: '',
    success: null,
  };

  table: Table<CommandExecVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newCommandExec: AddCommandExec = {
    autoExec: false,
    approvedBy: '',
    ccTo: '',
    applyRemark: '',
    command: '',
    execTarget: {
      instanceId: null,
      namespace: '',
    },
  };

  selectedTags: ICategorySearchTagItem[] = [];
  category: ICategorySearchTagItem[] = [
    {
      label: 'Namespace',
      field: 'namespace',
      type: 'textInput',
      group: 'Basic',
    },
    {
      label: 'ApplyUsername',
      field: 'applyUsername',
      type: 'textInput',
      group: 'Basic',
    },
    {
      label: 'ApprovedBy',
      field: 'approvedBy',
      type: 'textInput',
      group: 'Basic',
    },
    {
      label: 'Completed',
      field: 'completed',
      type: 'radio',
      group: 'Status',
      options: [
        { label: 'true', value: true }, { label: 'false', value: false },
      ],
    },
    {
      label: 'Success',
      field: 'success',
      type: 'radio',
      group: 'Status',
      options: [
        { label: 'true', value: true }, { label: 'false', value: false },
      ],
    },
  ];
  groupOrderConfig = [ 'Basic', 'Status' ];

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '50%',
      maxHeight: '1000px',
      content: CommandExecEditorComponent,
    },
    approveData: {
      content: CommandExecApproveComponent,
    },
    execData: {
      ...DIALOG_DATA.editorData,
      content: CommandExecDoComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private commandService: CommandService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: CommandExecPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.commandService.queryCommandExecPage(param));
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
      title: 'New Command',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newCommandExec)));
  }

  onRowApprove(rowItem: CommandExecVO) {
    const dialogDate = {
      ...this.dialogDate.approveData,
      title: 'Approve Command',
    };
    this.dialogUtil.onApproveDialog(dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowExec(rowItem: CommandExecVO) {
    const dialogDate = {
      ...this.dialogDate.execData,
      title: 'Command Exec',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowDelete(rowItem: CommandExecVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.commandService.deleteCommandById({ id: rowItem.id })
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
        obList.push(this.commandService.deleteCommandById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  finalSearchItems: any;
  finalSearchKey: any;
  extendedConfig = { more: { show: true } };

  searchEvent(event) {
    this.finalSearchItems = event ? event.selectedTags : {};
    this.finalSearchKey = event ? event.searchKey : '';
  }

  selectedTagsChange(event) {
    this.queryParam.namespace = '';
    this.queryParam.approvedBy = '';
    this.queryParam.applyUsername = '';
    this.queryParam.success = null;
    this.queryParam.completed = null;
    event.selectedTags.map(selectedTag => {
      switch (selectedTag.type) {
        case 'textInput':
          this.queryParam[selectedTag.field] = selectedTag.value.value;
          break;
        case 'radio':
          this.queryParam[selectedTag.field] = selectedTag.value.value.value;
          break;
        default:
          break;
      }
    });
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly JSON = JSON;
}
