import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  KubernetesResourceTemplateEdit,
  KubernetesResourceTemplatePageQuery,
  KubernetesResourceTemplateVO,
} from '../../../../@core/data/kubernetes-resource';
import {
  KubernetesResourceTemplateEditorComponent,
} from './kubernetes-resource-template-editor/kubernetes-resource-template-editor.component';
import { KubernetesResourceService } from '../../../../@core/services/kubernetes-resource.service';
import { KubernetesResourceCreateComponent } from './kubernetes-resource-create/kubernetes-resource-create.component';
import {
  KubernetesResourceTemplateCloneComponent,
} from './kubernetes-resource-template-clone/kubernetes-resource-template-clone.component';

@Component({
  selector: 'app-kubernetes-resource-template-data-table',
  templateUrl: './kubernetes-resource-template-data-table.component.html',
  styleUrls: [ './kubernetes-resource-template-data-table.component.less' ],
})
export class KubernetesResourceTemplateDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    edsType: '',
    valid: null,
  };
  businessType: string = BusinessTypeEnum.KUBERNETES_RESOURCE_TEMPLATE;

  table: Table<KubernetesResourceTemplateVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newKubernetesResourceTemplate: KubernetesResourceTemplateEdit = {
    name: '',
    templateKey: '',
    apiVersion: '',
    valid: true,
    custom: '',
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: KubernetesResourceTemplateEditorComponent,
      maxHeight: '1000px',
    },
    createResourceData: {
      ...DIALOG_DATA.editorData,
      content: KubernetesResourceCreateComponent,
    },
    cloneResourceTemplateData: {
      ...DIALOG_DATA.editorData,
      content: KubernetesResourceTemplateCloneComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private kubernetesResourceService: KubernetesResourceService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: KubernetesResourceTemplatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.kubernetesResourceService.queryTemplatePage(param));
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
      title: 'New Kubernetes Resource',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newKubernetesResourceTemplate)));
  }

  onRowEdit(rowItem: KubernetesResourceTemplateVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Kubernetes Resource',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowPreCreate(rowItem: KubernetesResourceTemplateVO): boolean {
    if (rowItem.instances.length > 0 && rowItem.namespaces.length > 0 && rowItem.kinds.length > 0) {
      return true;
    }
    return false;
  }

  onRowCreate(rowItem: KubernetesResourceTemplateVO) {
    const dialogDate = {
      ...this.dialogDate.createResourceData,
      title: 'Create Kubernetes Resource',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: KubernetesResourceTemplateVO) {
    this.kubernetesResourceService.setTemplateValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: KubernetesResourceTemplateVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.kubernetesResourceService.deleteTemplateById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowClone(rowItem: KubernetesResourceTemplateVO) {
    const dialogDate = {
      ...this.dialogDate.cloneResourceTemplateData,
      title: 'Clone Kubernetes Resource Template',
      width: '30%',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchValid,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.kubernetesResourceService.setTemplateValidById({ id: row.id }));
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
        obList.push(this.kubernetesResourceService.deleteTemplateById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: KubernetesResourceTemplateVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: KubernetesResourceTemplateVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  protected readonly getRowColor = getRowColor;

  ngOnInit(): void {
    this.fetchData();
  }

}
