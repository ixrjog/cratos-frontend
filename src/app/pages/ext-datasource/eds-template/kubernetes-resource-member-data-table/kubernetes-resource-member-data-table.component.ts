import { Component, ViewChild } from '@angular/core';
import { DataTableComponent, ICategorySearchTagItem } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import {
  KubernetesResourceMemberEdit,
  KubernetesResourceMemberPageQuery,
  KubernetesResourceTemplateMemberVO,
  KubernetesResourceTemplateVO,
} from '../../../../@core/data/kubernetes-resource';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { KubernetesResourceService } from '../../../../@core/services/kubernetes-resource.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import {
  KubernetesResourceMemberEditorComponent,
} from './kubernetes-resource-member-editor/kubernetes-resource-member-editor.component';
import { GroupPageQuery } from '../../../../@core/data/rbac';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kubernetes-resource-member-data-table',
  templateUrl: './kubernetes-resource-member-data-table.component.html',
  styleUrls: [ './kubernetes-resource-member-data-table.component.less' ],
})
export class KubernetesResourceMemberDataTableComponent {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    templateId: null,
    namespace: '',
    kind: '',
  };

  kubernetesResourceTemplate: KubernetesResourceTemplateVO = null;
  businessType: string = BusinessTypeEnum.KUBERNETES_RESOURCE_TEMPLATE_MEMBER;
  selectedTags: ICategorySearchTagItem[] = [];
  show = false;
  resourceKindOptions = [];

  category: ICategorySearchTagItem[] = [
    {
      label: 'QueryName',
      field: 'queryName',
      type: 'textInput',
      group: 'Basic',
    },
    {
      label: 'Namespace',
      field: 'namespace',
      type: 'textInput',
      group: 'Basic',
    },
  ];
  groupOrderConfig = [ 'Basic' ];

  table: Table<KubernetesResourceTemplateMemberVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newKubernetesResourceMember: KubernetesResourceMemberEdit = {
    templateId: null,
    namespace: '',
    kind: '',
    valid: true,
    content: '',
    custom: '',
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: KubernetesResourceMemberEditorComponent,
      maxHeight: '1000px',
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
    const param: KubernetesResourceMemberPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.kubernetesResourceService.queryMemberPage(param));
  }

  getResourceKindOptions() {
    let kindItem: ICategorySearchTagItem = {
      label: 'Kind',
      field: 'kind',
      type: 'radio',
      group: 'Basic',
      options: [],
    };
    this.kubernetesResourceService.getResourceKindOptions()
      .subscribe(({ body }) => {
        body.options.map(kind => {
          kindItem.options.push(kind);
        });
        this.category.push(kindItem);
        this.resourceKindOptions = kindItem.options;
        this.show = true;
      });
  }

  finalSearchItems: any;
  finalSearchKey: any;
  extendedConfig = { more: { show: true } };

  searchEvent(event) {
    this.finalSearchItems = event ? event.selectedTags : {};
    this.finalSearchKey = event ? event.searchKey : '';
  }

  selectedTagsChange(event) {
    this.queryParam.namespace = '';
    this.queryParam.kind = '';
    this.queryParam.queryName = '';
    event.selectedTags.map(selectedTag => {
      switch (selectedTag.type) {
        case 'textInput':
          this.queryParam[selectedTag.field] = selectedTag.value.value;
          break;
        case 'radio':
          this.queryParam[selectedTag.field] = selectedTag.value.value.value;
          break;
        default:
          break;
      }
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

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Kubernetes Resource Member',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
        this.fetchData();
      }, JSON.parse(JSON.stringify(this.newKubernetesResourceMember)),
      {
        kubernetesResourceTemplate: this.kubernetesResourceTemplate,
        resourceKindOptions: this.resourceKindOptions,
      });
  }

  onRowEdit(rowItem: KubernetesResourceTemplateMemberVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Kubernetes Resource Member',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
        this.fetchData();
      }, rowItem,
      {
        kubernetesResourceTemplate: this.kubernetesResourceTemplate,
        resourceKindOptions: this.resourceKindOptions,
      });
  }

  onRowValid(rowItem: KubernetesResourceTemplateMemberVO) {
    this.kubernetesResourceService.setMemberValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: KubernetesResourceTemplateMemberVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.kubernetesResourceService.deleteMemberById({ id: rowItem.id })
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
        obList.push(this.kubernetesResourceService.setMemberValidById({ id: row.id }));
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
        obList.push(this.kubernetesResourceService.deleteMemberById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onSearchResourceTemplate = (term: string) => {
    const param: GroupPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.kubernetesResourceService.queryTemplatePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((template, index) => ({ id: index, option: template })),
        ),
      );
  };

  onResourceTemplateChange(templateVO: KubernetesResourceTemplateVO) {
    this.queryParam.templateId = templateVO.id;
    this.fetchData();
  }

  protected readonly getRowColor = getRowColor;

}
