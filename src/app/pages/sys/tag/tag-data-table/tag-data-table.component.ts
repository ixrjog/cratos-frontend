import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from '../../../../@core/data/base-data';
import { TagService } from '../../../../@core/services/tag.service';
import { TagPageQuery, TagVo } from '../../../../@core/data/tag';
import { DataTableComponent, DialogService } from 'ng-devui';
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
    { field: 'tagType', header: 'Tag Type', fieldType: 'text' },
    { field: 'tagKey', header: 'Tag Key', fieldType: 'text' },
    { field: 'tagValue', header: 'Tag Value', fieldType: 'text' },
    { field: 'color', header: 'Color', fieldType: 'text' },
    { field: 'createTime', header: 'Create Time', fieldType: 'date' },
    { field: 'actions', header: 'Actions', fixedRight: '0px' },
  ];

  constructor(private tagService: TagService,
              private dialogService: DialogService) {
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
    backdropCloseable: true,
  };

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
            results.modalContentInstance.submitForm();
            results.modalInstance.hide();
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
        ...rowItem,
      },
    });
    console.log(111111);
    console.log(results.modalContentInstance);
    console.log(111111);
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
}
