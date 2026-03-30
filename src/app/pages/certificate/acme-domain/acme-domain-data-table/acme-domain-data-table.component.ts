import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AcmeDomainPageQuery, AcmeDomainVO, AcmeService } from '../../../../@core/services/acme.service';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { AcmeDomainEditorComponent } from './acme-domain-editor/acme-domain-editor.component';

@Component({
  selector: 'app-acme-domain-data-table',
  templateUrl: './acme-domain-data-table.component.html',
  styleUrls: ['./acme-domain-data-table.component.less'],
})
export class AcmeDomainDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;
  businessType: string = BusinessTypeEnum.ACME_DOMAIN;

  queryParam = {
    queryName: '',
  };

  table: Table<AcmeDomainVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: AcmeDomainEditorComponent,
    },
  };

  newDomain = {
    name: '--',
    domain: '',
    domains: '',
    zoneId: '',
    dnsResolverInstanceId: null,
    accountId: null,
    dcvType: '',
    dcvDelegationTarget: '',
    valid: true,
    comment: '',
  };

  constructor(private acmeService: AcmeService, private dialogUtil: DialogUtil) {
  }

  fetchData() {
    const param: AcmeDomainPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.acmeService.queryAcmeDomainPage(param));
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
      title: 'New ACME Domain',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newDomain)));
  }

}
