import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  TrafficLayerDomainEdit,
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordPageQuery,
} from '../../../../@core/data/traffic-layer';
import { TrafficLayerDomainEditorComponent } from './traffic-layer-domain-editor/traffic-layer-domain-editor.component';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import { CertificateVO } from '../../../../@core/data/certificate';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { catchError } from 'rxjs/operators';
import { countResource } from '../../../../@shared/utils/resource-count.util';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';

@Component({
  selector: 'app-traffic-layer-domain-data-table',
  templateUrl: './traffic-layer-domain-data-table.component.html',
  styleUrls: [ './traffic-layer-domain-data-table.component.less' ],
})
export class TrafficLayerDomainDataTableComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  businessType: string = BusinessTypeEnum.TRAFFIC_LAYER_DOMAIN;

  queryParam = {
    queryName: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  table: Table<TrafficLayerDomainVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: TrafficLayerDomainEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  newTrafficLayerDomain: TrafficLayerDomainEdit = {
    domain: '',
    name: '',
    comment: '',
    valid: true,
  };
  protected readonly getRowColor = getRowColor;

  constructor(private trafficLayerService: TrafficLayerService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  fetchData() {
    const param: TrafficLayerDomainPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    
    this.table.loading = true;
    this.trafficLayerService.queryTrafficLayerDomainPage(param).subscribe({
      next: (result) => {
        if (result.success) {
          // 为每个域名获取对应的记录
          const domains = result.body.data;
          const recordPromises = domains.map(domain => 
            this.trafficLayerService.queryTrafficLayerRecordPage({
              queryName: '',
              page: 0,
              length: 1000,
              domainId: domain.id,
              hasRouteTrafficTo: false
            }).toPromise()
          );
          
          Promise.all(recordPromises).then(recordResults => {
            domains.forEach((domain, index) => {
              const recordResult = recordResults[index];
              domain.records = recordResult?.success ? recordResult.body.data : [];
            });
            
            this.table.data = domains;
            this.table.pager.total = result.body.totalNum;
            this.table.loading = false;
          });
        } else {
          this.table.loading = false;
        }
      },
      error: () => {
        this.table.loading = false;
      }
    });
  }

  onCellEditEnd(event) {
    const param: TrafficLayerDomainEdit = {
      id: event.rowItem.id,
      domain: event.rowItem.domain,
      name: event.rowItem.name,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
    };
    this.trafficLayerService.updateTrafficLayerDomain(param)
      .pipe(
        catchError((error: any) => {
          this.fetchData();
          return new error();
        }),
      )
      .subscribe();
  }

  ngOnInit() {
    setTimeout(() => {
      this.businessCascader.getTagOptions();
    }, 500);
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
      title: 'New Traffic Layer Domain',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newTrafficLayerDomain)));
  }

  onRowEdit(rowItem: TrafficLayerDomainVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Traffic Layer Domain',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: TrafficLayerDomainVO) {
    this.trafficLayerService.setTrafficLayerDomainValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: TrafficLayerDomainVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.trafficLayerService.deleteTrafficLayerDomain({ id: rowItem.id })
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
        obList.push(this.trafficLayerService.setTrafficLayerDomainValidById({ id: row.id }));
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
        obList.push(this.trafficLayerService.deleteTrafficLayerDomain({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: CertificateVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onBatchTag() {
    this.dialogUtil.onBusinessTagBatchEditDialog(
      this.businessType, this.datatable.getCheckedRows(), () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: CertificateVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  protected readonly countResource = countResource;
}
