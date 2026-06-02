import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ProjectPageQuery, ProjectVO, ProjectService } from '../../../../@core/services/project.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { ProjectConfigEditorComponent } from './project-config-editor/project-config-editor.component';

@Component({
  selector: 'app-project-config-data-table',
  templateUrl: './project-config-data-table.component.html',
  styleUrls: ['./project-config-data-table.component.less'],
})
export class ProjectConfigDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  queryParam = {
    queryName: '',
  };

  table: Table<ProjectVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: ProjectConfigEditorComponent,
    },
  };

  newProject = {
    key: '',
    name: '',
    valid: true,
    comment: '',
  };

  constructor(private projectService: ProjectService, private dialogUtil: DialogUtil, private toastUtil: ToastUtil) {
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const param: ProjectPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.projectService.queryProjectPage(param));
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
      title: 'New Project',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newProject)));
  }

  onRowEdit(rowItem: ProjectVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Project',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  onRowDelete(rowItem: ProjectVO) {
    const dialogDate = {
      ...DIALOG_DATA.warningOperateData,
      content: '<strong>Confirm delete this project?</strong>',
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.projectService.deleteProject({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }
}
