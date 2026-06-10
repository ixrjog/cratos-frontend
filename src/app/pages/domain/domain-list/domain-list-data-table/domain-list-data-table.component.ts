import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomainEdit, DomainPageQuery, DomainVO } from '../../../../@core/data/domian';
import { DomainEditorComponent } from './domain-editor/domain-editor.component';
import { DomainService } from '../../../../@core/services/domain.service';
import { AccountEntityService } from '../../../../@core/services/account-entity.service';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-domain-list-data-table',
  templateUrl: './domain-list-data-table.component.html',
  styleUrls: [ './domain-list-data-table.component.less' ],
})
export class DomainListDataTableComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  private static readonly DOMAIN_TYPE_STORAGE_KEY = 'domain_selected_type';

  queryParam = {
    queryName: localStorage.getItem('domain_search_query') || '',
    domainType: localStorage.getItem(DomainListDataTableComponent.DOMAIN_TYPE_STORAGE_KEY) || '',
    accountEntityId: JSON.parse(localStorage.getItem('domain_account_entity_id') || 'null'),
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  domainTypeOptions = [];
  protected readonly limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.DOMAIN;
  selectedAccountEntity: any = JSON.parse(localStorage.getItem('domain_account_entity') || 'null');

  onSearchAccountEntity = (term: string) => {
    return this.accountEntityService.queryAccountEntityPage({ queryName: term, page: 1, length: 20 })
      .pipe(
        map(({ body }) => body.data.map((item, index) => ({ id: index, option: item }))),
      );
  };

  onAccountEntityFilterChange(entity: any) {
    this.selectedAccountEntity = entity;
    this.queryParam.accountEntityId = entity?.id || null;
    localStorage.setItem('domain_account_entity_id', JSON.stringify(entity?.id || null));
    localStorage.setItem('domain_account_entity', JSON.stringify(entity || null));
    this.fetchData();
  }

  table: Table<DomainVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newDomain: DomainEdit = {
    domainType: '',
    expiry: Date.now(),
    name: '',
    registrationTime: Date.now(),
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: DomainEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };
  protected readonly getRowColor = getRowColor;

  constructor(
    private domainService: DomainService,
    private accountEntityService: AccountEntityService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    localStorage.setItem('domain_search_query', this.queryParam.queryName);
    const param: DomainPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.domainService.queryDomainPage(param));
  }

  exportCsv() {
    const param: DomainPageQuery = {
      ...this.queryParam,
      page: 1,
      length: this.table.pager.total || 10000,
    };
    this.domainService.queryDomainPage(param).subscribe(({ body }) => {
      const headers = ['Name', 'Domain Type', 'Instance', 'Account Entity', 'Registration Time', 'Expiry', 'Valid', 'Comment'];
      const rows = (body.data || []).map((d: any) => [
        d.name,
        d.domainType,
        d.instanceName || '',
        d.accountEntity?.name || '',
        d.registrationTime ? new Date(d.registrationTime).toISOString().split('T')[0] : '',
        d.expiry ? new Date(d.expiry).toISOString().split('T')[0] : '',
        d.valid ? 'Y' : 'N',
        d.comment || '',
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.map(v => '"' + (v || '').replace(/"/g, '""') + '"').join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'domains_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.businessCascader.getTagOptions();
    }, 500);
    this.fetchData();
    this.getDomainTypeOptions();
  }

  getDomainTypeOptions() {
    this.domainService.getDomainTypeOptions()
      .subscribe(({ body }) => {
        this.domainTypeOptions = body.options;
      });
  }

  onDomainTypeChange(domainType: any) {
    const value = typeof domainType === 'object' ? domainType?.value || '' : domainType || '';
    this.queryParam.domainType = value;
    localStorage.setItem(DomainListDataTableComponent.DOMAIN_TYPE_STORAGE_KEY, value);
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
      title: 'New Domain',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newDomain)));
  }

  onRowEdit(rowItem: DomainVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Domain',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      ...rowItem,
      expiry: new Date(rowItem.expiry),
      registrationTime: new Date(rowItem.registrationTime),
    });
  }

  onRowValid(rowItem: DomainVO) {
    this.domainService.setDomainValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: DomainVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.domainService.deleteDomainById({ id: rowItem.id })
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
        obList.push(this.domainService.setDomainValidById({ id: row.id }));
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
        obList.push(this.domainService.deleteDomainById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: DomainVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onBatchTag() {
    this.dialogUtil.onBusinessTagBatchEditDialog(
      this.businessType, this.datatable.getCheckedRows(), () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: DomainVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

}
