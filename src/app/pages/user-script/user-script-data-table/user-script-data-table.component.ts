import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { UserScriptEdit, UserScriptPageQuery, UserScriptVO } from '../../../@core/data/user-script';
import { UserScriptService } from '../../../@core/services/user-script.service';
import { UserScriptEditorComponent } from './user-script-editor/user-script-editor.component';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';

@Component({
  selector: 'app-user-script-data-table',
  templateUrl: './user-script-data-table.component.html',
  styleUrls: [ './user-script-data-table.component.less' ],
})
export class UserScriptDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;

  queryParam = {
    queryName: '',
    function: '',
    osType: '',
    valid: null,
  };

  table: Table<UserScriptVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  /** 功能 tab: 所有不重名的 function('' 表示全部) */
  functionTabs: string[] = [];
  activeFunction: string | number = '';

  newUserScript: UserScriptEdit = {
    name: '',
    function: '',
    osType: '',
    scriptContent: '',
    comment: '',
    valid: true,
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: UserScriptEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private userScriptService: UserScriptService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  ngOnInit() {
    this.fetchData();
    this.loadFunctionTabs();
  }

  /** 拉取(不分页)提取所有不重名的功能作为 tab */
  loadFunctionTabs() {
    this.userScriptService.queryUserScriptPage({
      page: 1,
      length: 500,
      queryName: '',
      function: '',
      osType: '',
      valid: null,
    }).subscribe(({ body }) => {
      const set = new Set<string>();
      (body.data || []).forEach(s => {
        if (s.function && s.function.trim()) {
          set.add(s.function);
        }
      });
      this.functionTabs = Array.from(set).sort();
    });
  }

  onFunctionTabChange(fn: string) {
    this.activeFunction = fn;
    this.queryParam.function = fn;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  fetchData() {
    const param: UserScriptPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.userScriptService.queryUserScriptPage(param));
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
    const h = Math.round(window.innerHeight * 0.8);
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Script',
      width: '60%',
      height: h + 'px',
      maxHeight: h + 'px',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
      this.loadFunctionTabs();
    }, JSON.parse(JSON.stringify(this.newUserScript)));
  }

  onRowEdit(rowItem: UserScriptVO) {
    const h = Math.round(window.innerHeight * 0.8);
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Script',
      width: '60%',
      height: h + 'px',
      maxHeight: h + 'px',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
      this.loadFunctionTabs();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  onRowValid(rowItem: UserScriptVO) {
    this.userScriptService.setUserScriptValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: UserScriptVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.userScriptService.deleteUserScriptById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
          this.loadFunctionTabs();
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
        obList.push(this.userScriptService.deleteUserScriptById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onSearch() {
    this.fetchData();
  }

  /** 脚本前 2 行预览 */
  scriptPreview(content: string): string {
    if (!content) {
      return '';
    }
    return content.split('\n').slice(0, 2).join('\n');
  }

  /** 脚本总行数 */
  scriptLineCount(content: string): number {
    if (!content) {
      return 0;
    }
    return content.split('\n').length;
  }

  protected readonly getRowColor = getRowColor;
  protected readonly limit = RELATIVE_TIME_LIMIT;
}
