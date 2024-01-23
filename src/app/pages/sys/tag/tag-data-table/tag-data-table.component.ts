import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from '../../../../@core/data/base-data';
import { TagService } from '../../../../@core/services/tag.service';
import { TagEdit, TagPageQuery, TagVo } from '../../../../@core/data/tag';
import { DataTableComponent, DialogService, ToastService } from 'ng-devui';
import { TagEditorComponent } from './tag-editor/tag-editor.component';

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
    private dialogService: DialogService,
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

  getValid(): string {
    return 'var(--devui-success)';
    // return 'var(--devui-danger)'
  }

  dialogDate = {
    id: 'tag-editor',
    width: '30%',
    maxHeight: '600px',
    content: TagEditorComponent,
    backdropCloseable: false,
  };

  OnNewRow(dialogtype: string) {
    const results = this.dialogService.open({
      title: 'New Tag',
      ...this.dialogDate,
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          disabled: false,
          handler: ($event: Event) => {
            results.modalContentInstance.addForm()
              .subscribe(() => {
                this.toastService.open({
                  value: [ { severity: 'success', summary: 'Success', content: 'Add Success' } ],
                  life: 2000,
                });
                results.modalInstance.hide();
                this.fetchData();
              });
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        formData: this.newTag,
        canConfirm: (value: boolean) => {
          results.modalInstance.updateButtonOptions([ { disabled: !value } ]);
        },
      },
    });
  }


  onRowEdit(rowItem: TagVo, dialogtype: string) {
    const results = this.dialogService.open({
      title: 'Edit Tag',
      ...this.dialogDate,
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          disabled: false,
          handler: ($event: Event) => {
            results.modalContentInstance.updateForm()
              .subscribe(() => {
                this.toastService.open({
                  value: [ { severity: 'success', summary: 'Success', content: 'Update Success' } ],
                  life: 2000,
                });
                results.modalInstance.hide();
                this.fetchData();
              });
          }
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        formData: rowItem,
        canConfirm: (value: boolean) => {
          results.modalInstance.updateButtonOptions([ { disabled: !value } ]);
        },
      },
    });
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

  onDelete($event: MouseEvent) {
    console.log('on delete')
  }
}
