import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DatacenterService } from '../../../../@core/services/datacenter.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { DatacenterAllocationEditorComponent } from './datacenter-allocation-editor/datacenter-allocation-editor.component';
import { DatacenterAllocationFindCidrComponent } from './datacenter-allocation-find-cidr/datacenter-allocation-find-cidr.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { DialogService } from 'ng-devui';

@Component({
  selector: 'app-datacenter-allocation-data-table',
  templateUrl: './datacenter-allocation-data-table.component.html',
  styleUrls: ['./datacenter-allocation-data-table.component.less'],
})
export class DatacenterAllocationDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  queryParam = {
    networkId: null as number,
    queryName: '',
  };

  table: Table<any> = JSON.parse(JSON.stringify(TABLE_DATA));

  selectedNetwork: any;

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: DatacenterAllocationEditorComponent,
    },
  };

  constructor(
    private datacenterService: DatacenterService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['networkId']) {
        this.queryParam.networkId = +params['networkId'];
        this.selectedNetwork = { id: this.queryParam.networkId };
      }
      this.fetchData();
    });
  }

  onSearchNetwork = (term: string) => {
    return this.datacenterService.queryNetworkPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) =>
          body.data.map((network, index) => ({ id: index, option: network })),
        ),
      );
  };

  onNetworkChange(network: any) {
    this.queryParam.networkId = network?.id || null;
    this.selectedNetwork = network;
    if (this.queryParam.networkId) {
      this.table.pager.pageIndex = 1;
      this.fetchData();
    }
  }

  fetchData() {
    const param = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.datacenterService.queryAllocationPage(param));
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Allocation',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      networkId: this.queryParam.networkId,
      name: '',
      region: '',
      cidr: '',
      allocationType: 'VPC',
      allowOverlap: false,
      nat: '',
      valid: true,
      comment: '',
    }, { selectedNetwork: this.selectedNetwork });
  }

  onRowEdit(rowItem: any) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Allocation',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  onRowDelete(rowItem: any) {
    const dialogDate = {
      ...DIALOG_DATA.warningOperateData,
      content: '<strong>Confirm delete this allocation?</strong>',
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.datacenterService.deleteAllocationById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onFindAvailable() {
    this.dialogService.open({
      id: 'find-available-cidr',
      title: 'Find Available CIDR',
      width: '600px',
      maxHeight: '500px',
      backdropCloseable: true,
      dialogtype: 'standard',
      content: DatacenterAllocationFindCidrComponent,
      buttons: [
        {
          cssClass: 'common',
          text: 'Close',
          handler: ($event: any) => $event.modalInstance.hide(),
        },
      ],
      data: {},
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
