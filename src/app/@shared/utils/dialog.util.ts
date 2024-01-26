import { Injectable } from '@angular/core';
import { DialogService, ToastService } from 'ng-devui';
import { Observable } from 'rxjs';

@Injectable()
export class DialogUtil {

  constructor(private dialogService: DialogService,
              private toastService: ToastService) {
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
          text: '确定',
          disabled: false,
          handler: ($event: Event) => {
            let ob: Observable<any>;
            let content: string;
            if (operationType) {
              content = 'Add Success';
              ob = results.modalContentInstance.addForm();
            } else {
              content = 'Update Success';
              ob = results.modalContentInstance.updateForm();
            }
            ob.subscribe(() => {
              this.toastService.open({
                value: [ { severity: 'success', summary: 'Success', content: content } ],
                life: 2000,
              });
              onFetch();
              results.modalInstance.hide();
            });
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
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
