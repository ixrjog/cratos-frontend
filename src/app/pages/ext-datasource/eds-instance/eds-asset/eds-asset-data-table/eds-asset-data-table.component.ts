import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import {
  AssetPageQuery,
  DeleteInstanceAsset,
  EdsAssetIndexVO,
  EdsAssetVO,
  ImportInstanceAsset,
} from '../../../../../@core/data/ext-datasource';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import {
  CertificateEditorComponent,
} from '../../../../certificate/certificate-list/certificate-list-data-table/certificate-editor/certificate-editor.component';
import { getResourceCountColor, parseResourceCount } from '../../../../../@shared/utils/resource-count.util';
import {
  DomainEditorComponent,
} from '../../../../domain/domain-list/domain-list-data-table/domain-editor/domain-editor.component';
import {
  GlobalNetworkSubnetEditorComponent,
} from '../../../../global-network/global-network-subnet/global-network-subnet-data-table/global-network-subnet-editor/global-network-subnet-editor.component';
import {
  BusinessCascaderComponent,
} from '../../../../../@shared/components/common/business-cascader/business-cascader.component';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-eds-asset-data-table',
  templateUrl: './eds-asset-data-table.component.html',
  styleUrls: [ './eds-asset-data-table.component.less' ],
})
export class EdsAssetDataTableComponent implements OnChanges {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;

  @Input() instanceId: number;
  @Input() assetType: string;
  @Input() currentType: string;

  assetIndexTable: EdsAssetIndexVO[] = [];
  businessType: string = BusinessTypeEnum.EDS_ASSET;

  queryParam = {
    queryName: '',
    valid: null,
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  protected readonly limit = RELATIVE_TIME_LIMIT;

  table: Table<EdsAssetVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsService: EdsService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.assetType === this.currentType) {
      setTimeout(() => {
        this.businessCascader.getTagOptions();
      }, 500);
      this.fetchData();
    }
  }

  onAssetImport() {
    const param: ImportInstanceAsset = {
      instanceId: this.instanceId,
      assetType: this.assetType,
    };
    this.edsService.importEdsInstanceAsset(param)
      .subscribe(() => this.toastUtil.onSuccessToast(TOAST_CONTENT.IMPORT));
  }

  fetchData() {
    const param: AssetPageQuery = {
      ...this.queryParam,
      instanceId: this.instanceId,
      assetType: this.assetType,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.edsService.queryEdsInstanceAssetPage(param));
  }

  onInstanceAssetDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.deleteAll,
    };
    const param: DeleteInstanceAsset = {
      assetType: this.assetType,
      instanceId: this.instanceId,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.edsService.deleteEdsInstanceAsset(param)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
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

  onRowBusinessTag(rowItem: EdsAssetVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowDelete(rowItem: EdsAssetVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.edsService.deleteEdsInstanceAssetById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowImport(rowItem: EdsAssetVO) {
    this.edsService.getToBusinessTarget({ assetId: rowItem.id })
      .subscribe(({ body }) => {
        let dialogDate = {
          ...this.dialogDate.editorData,
        };
        switch (body.toBusiness.businessType) {
          case BusinessTypeEnum.USER:
            dialogDate['title'] = 'New User';
            this.dialogUtil.onUserEditDialog(ADD_OPERATION, dialogDate, () => {
              this.fetchData();
            }, body.target, { fromAssetId: rowItem.id });
            break;
          case BusinessTypeEnum.CERTIFICATE:
            dialogDate['content'] = CertificateEditorComponent;
            dialogDate['title'] = 'New Certificate';
            this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
              this.fetchData();
            }, body.target, { fromAssetId: rowItem.id });
            break;
          case BusinessTypeEnum.DOMAIN:
            dialogDate['content'] = DomainEditorComponent;
            dialogDate['title'] = 'New Domain';
            this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
              this.fetchData();
            }, body.target, { fromAssetId: rowItem.id });
            break;
          case BusinessTypeEnum.GLOBAL_NETWORK_SUBNET:
            dialogDate['content'] = GlobalNetworkSubnetEditorComponent;
            dialogDate['title'] = 'New Global Network Subnet';
            this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
              this.fetchData();
            }, body.target, { fromAssetId: rowItem.id });
            break;
          default:
            this.toastUtil.onErrorToast('nonsupport convert');
            throw new Error('nonsupport convert');
        }
      });
  }

  onRowValid(rowItem: EdsAssetVO) {
    this.edsService.setEdsInstanceAssetValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
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
        obList.push(this.edsService.deleteEdsInstanceAssetById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
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
        obList.push(this.edsService.setEdsInstanceAssetValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
    });
  }

  onQueryAssetIndex(rowItem: EdsAssetVO) {
    this.assetIndexTable = [];
    if (!parseResourceCount(rowItem)) {
      return;
    }
    this.edsService.queryAssetIndexByAssetId({ assetId: rowItem.id })
      .subscribe(({ body }) => this.assetIndexTable = body);
  }

  protected readonly getRowColor = getRowColor;
  protected readonly getResourceCountColor = getResourceCountColor;
  protected readonly JSON = JSON;
  protected readonly parseResourceCount = parseResourceCount;

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }
}
