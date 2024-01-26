import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResult, Table } from '../../../../@core/data/base-data';
import { TagService } from '../../../../@core/services/tag.service';
import { TagEdit, TagPageQuery, TagVo } from '../../../../@core/data/tag';
import { DataTableComponent, ToastService } from 'ng-devui';
import { TagEditorComponent } from './tag-editor/tag-editor.component';
import { Observable, zip } from 'rxjs';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { getRowColor } from 'src/app/@shared/utils/data-table.utli';

@Component({
  selector: 'app-tag-data-table',
  templateUrl: './tag-data-table.component.html',
  styleUrls: [ './tag-data-table.component.less' ],
})
export class TagDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @Input() queryParam = {
    tagKey: '',
  };

  table: Table<TagVo> = {
    showLoading: false,
    data: [],
    pager: { pageIndex: 1, pageSize: 10, total: 0 },
  };

  columns = [
    { field: 'tagKey', header: 'Tag Key', fieldType: 'text',width: '150px' },
    { field: 'tagValue', header: 'Tag Value', fieldType: 'text' },
    { field: 'tagType', header: 'Tag Type', fieldType: 'text' },
    { field: 'color', header: 'Color', fieldType: 'text' },
    { field: 'promptColor', header: 'Prompt Color', fieldType: 'text' },
    { field: 'seq', header: 'Seq', fieldType: 'text' },
    { field: 'createTime', header: 'Create Time', fieldType: 'date' },
  ];

  newTag: TagEdit = {
    color: '#FFFFFF', promptColor: 'BLACK', seq: 1, tagKey: '', tagType: 'CUSTOM', valid: true,
  };

  constructor(
    private tagService: TagService,
    private dialogUtil: DialogUtil,
    private toastService: ToastService,
  ) {
  }

  fetchData() {
    this.table.data = [];
    this.table.showLoading = true;
    const param: TagPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    this.tagService.queryTagPage(param)
      .subscribe(({ body }) => {
        this.table.data = body.data;
        this.table.showLoading = false;
        this.table.pager.total = body.totalNum;
      });
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

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: TagEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    }
  }

  onRowNew() {
    const dialogDate = {
      title: 'New Tag',
      ...this.dialogDate.editorData,
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newTag);
  }

  onRowEdit(rowItem: TagVo) {
    const dialogDate = {
      title: 'Edit Tag',
      ...this.dialogDate.editorData,
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowCheckChange(checked, rowIndex, nestedIndex, rowItem) {
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    this.datatable.setRowCheckStatus({
      rowIndex: rowIndex,
      nestedIndex: nestedIndex,
      rowItem: rowItem,
      checked: checked,
    });
  }

  onRowDelete(rowItem: TagVo) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.tagService.deleteTagById({ id: rowItem.id })
        .subscribe(() => {
          this.toastService.open({
            value: [ { severity: 'success', summary: 'Success', content: 'Delete Success' } ],
            life: 2000,
          });
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
      const checkedRows: TagVo[] = this.datatable.getCheckedRows();
      let obList: Observable<HttpResult<Boolean>>[] = [];
      for (let row of checkedRows) {
        obList.push(this.tagService.setTagValidById({ id: row.id }));
      }
      zip(obList)
        .subscribe(() => {
          this.toastService.open({
            value: [ { severity: 'success', summary: 'Success', content: 'Batch update Success' } ],
            life: 2000,
          });
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
      const checkedRows: TagVo[] = this.datatable.getCheckedRows();
      let obList: Observable<HttpResult<Boolean>>[] = [];
      for (let row of checkedRows) {
        obList.push(this.tagService.deleteTagById({ id: row.id }));
      }
      zip(obList)
        .subscribe(() => {
          this.toastService.open({
            value: [ { severity: 'success', summary: 'Success', content: 'Batch delete Success' } ],
            life: 2000,
          });
          this.fetchData();
        });
    });
  }

  onRowValid(rowItem: any) {
    this.tagService.setTagValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  protected readonly getRowColor = getRowColor;
}
