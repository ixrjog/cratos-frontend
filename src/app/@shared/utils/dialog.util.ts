import { Injectable } from '@angular/core';
import { DialogService } from 'ng-devui';
import { TagEditorComponent } from '../../pages/sys/tag/tag-data-table/tag-editor/tag-editor.component';

@Injectable()
export class DialogUtil {

  constructor(private dialogService: DialogService) {
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
}

export const DIALOG_DATA = {
  editorData: {
    id: 'editor-data',
    width: '30%',
    maxHeight: '600px',
    backdropCloseable: false,
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
