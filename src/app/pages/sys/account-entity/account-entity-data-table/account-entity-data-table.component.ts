import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AccountEntityService } from '../../../../@core/services/account-entity.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { AccountEntityEditorComponent } from './account-entity-editor/account-entity-editor.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-entity-data-table',
  templateUrl: './account-entity-data-table.component.html',
  styleUrls: ['./account-entity-data-table.component.less'],
})
export class AccountEntityDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  queryParam = {
    queryName: '',
  };

  table: Table<any> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: AccountEntityEditorComponent,
    },
  };

  newEntity = {
    name: '',
    entityType: 'COMPANY',
    registeredName: '',
    country: '',
    registrationNo: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    comment: '',
  };

  constructor(private accountEntityService: AccountEntityService, private dialogUtil: DialogUtil, private translate: TranslateService) {
  }

  fetchData() {
    const param = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.accountEntityService.queryAccountEntityPage(param));
  }

  ngOnInit() {
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: this.translate.instant('accountEntity.dialog.newTitle'),
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newEntity)));
  }

  onRowEdit(rowItem: any) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: this.translate.instant('accountEntity.dialog.editTitle'),
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

}
