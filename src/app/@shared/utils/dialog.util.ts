import { Injectable } from '@angular/core';
import { DialogService } from 'ng-devui';
import { Observable } from 'rxjs';
import { TOAST_CONTENT, ToastUtil } from './toast.util';
import {
  BusinessTagEditorComponent
} from '../components/common/business-tag/business-tag-editor/business-tag-editor.component';
import { BusinessDocsComponent } from '../components/common/business-doc/business-docs/business-docs.component';

@Injectable()
export class DialogUtil {

  constructor(private dialogService: DialogService,
              private toastUtil: ToastUtil) {
  }

  onDialog(dialogDate: any, handler: Function) {
    const results = this.dialogService.open({
      ...dialogDate,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Confirm',
          handler: ($event: Event) => {
            handler();
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  onEditDialog(operationType: boolean, dialogDate: any, onFetch: Function, data: any, extend?: any) {
    const results = this.dialogService.open({
      ...dialogDate,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Confirm',
          disabled: false,
          handler: ($event: Event) => {
            let ob: Observable<any>;
            let content: string;
            if (operationType) {
              content = TOAST_CONTENT.ADD;
              ob = results.modalContentInstance.addForm();
            } else {
              content = TOAST_CONTENT.UPDATE;
              ob = results.modalContentInstance.updateForm();
            }
            ob.subscribe(() => {
              this.toastUtil.onSuccessToast(content);
              onFetch();
              results.modalInstance.hide();
            });
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        formData: data,
        operationType: operationType,
        ...extend
      },
    });
  }

  onBusinessTagEditDialog(businessType: string, businessObject: any, onFetch: Function) {
    const results = this.dialogService.open({
      id: 'business-tag-edit',
      width: '50%',
      maxHeight: '600px',
      backdropCloseable: false,
      dialogtype: 'standard',
      content: BusinessTagEditorComponent,
      buttons: [
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Confirm',
          handler: ($event: Event) => {
            onFetch();
            results.modalInstance.hide();
          },
        },
      ],
      data: {
        businessType: businessType,
        businessObject: businessObject,
      },
    });
  }

  onBusinessDocsEditDialog(businessType: string, businessObject: any, onFetch: Function) {
    const results = this.dialogService.open({
      id: 'business-docs-edit',
      width: '70%',
      maxHeight: '1000px',
      backdropCloseable: false,
      dialogtype: 'standard',
      content: BusinessDocsComponent,
      buttons: [],
      data: {
        businessType: businessType,
        businessObject: businessObject,
      },
    });
  }
}

export const DIALOG_DATA = {
  editorData: {
    id: 'editor-data',
    width: '30%',
    maxHeight: '600px',
    backdropCloseable: false,
    dialogtype: 'standard',
  },
  warningOperateData: {
    id: 'warning-operate',
    width: '346px',
    maxHeight: '600px',
    zIndex: 1050,
    backdropCloseable: true,
    html: true,
    dialogtype: 'warning',
  },
  content: {
    delete: '<strong>Confirm delete this row ?</strong>',
    batchDelete: '<strong>Confirm delete these rows ?</strong>',
    batchValid: '<strong>Confirm update these rows ?</strong>',
  }
}

export const ADD_OPERATION = true;
export const UPDATE_OPERATION = false;
