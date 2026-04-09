import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DatacenterService } from '../../../../@core/services/datacenter.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { DatacenterNetworkEditorComponent } from './datacenter-network-editor/datacenter-network-editor.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datacenter-network-data-table',
  templateUrl: './datacenter-network-data-table.component.html',
  styleUrls: ['./datacenter-network-data-table.component.less'],
})
export class DatacenterNetworkDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  queryParam = {
    queryName: '',
  };

  table: Table<any> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: DatacenterNetworkEditorComponent,
    },
  };

  newNetwork = {
    name: '',
    datacenterType: 'CLOUD',
    comment: '',
  };

  constructor(private datacenterService: DatacenterService, private dialogUtil: DialogUtil, private router: Router) {
  }

  fetchData() {
    const param = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.datacenterService.queryNetworkPage(param));
  }

  ngOnInit() {
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Datacenter Network',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newNetwork)));
  }

  onRowEdit(rowItem: any) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Datacenter Network',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  onViewAllocations(rowItem: any) {
    this.router.navigate(['/pages/datacenter/allocation'], { queryParams: { networkId: rowItem.id } });
  }

  onScanAllocation(rowItem: any) {
    this.datacenterService.scanNetworkAllocation({ networkId: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
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
