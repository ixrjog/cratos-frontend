import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { TagService } from '../../../../@core/services/tag.service';
import { TagEdit, TagPageQuery, TagVO } from '../../../../@core/data/tag';
import { DataTableComponent } from 'ng-devui';
import { TagEditorComponent } from './tag-editor/tag-editor.component';
import { Observable, zip } from 'rxjs';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { getRowColor, onFetchValidData } from 'src/app/@shared/utils/data-table.utli';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-tag-data-table',
  templateUrl: './tag-data-table.component.html',
  styleUrls: [ './tag-data-table.component.less' ],
})
export class TagDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @Input()
  queryParam = {
    tagKey: '',
  };

  table: Table<TagVO> = {
    ...TABLE_DATA
  };

  newTag: TagEdit = {
    color: '#000000', promptColor: 'BLACK', seq: 1, tagKey: '', tagType: 'CUSTOM', valid: true,
  };

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
    },
  };

  constructor(
    private tagService: TagService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: TagPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.tagService.queryTagPage(param));
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
      title: 'New Tag',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newTag);
  }

  onRowEdit(rowItem: TagVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Tag',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowDelete(rowItem: TagVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.tagService.deleteTagById({ id: rowItem.id })
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
        obList.push(this.tagService.setTagValidById({ id: row.id }));
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
        obList.push(this.tagService.deleteTagById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowValid(rowItem: any) {
    this.tagService.setTagValidById({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
  }

  protected readonly getRowColor = getRowColor;
}
