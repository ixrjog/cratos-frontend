import { Injectable } from '@angular/core';
import { DialogService } from 'ng-devui';
import { Observable } from 'rxjs';
import { TOAST_CONTENT, ToastUtil } from './toast.util';
import {
  BusinessTagEditorComponent,
} from '../components/common/business-tag/business-tag-editor/business-tag-editor.component';
import { BusinessDocsComponent } from '../components/common/business-doc/business-docs/business-docs.component';
import { UserEditorComponent } from '../../pages/user/user-list/user-list-data-table/user-editor/user-editor.component';
import { RobotEditorComponent } from '../../pages/sys/robot/robot-data-table/robot-editor/robot-editor.component';

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
      maxHeight: '800px',
      backdropCloseable: false,
      dialogtype: 'standard',
      content: BusinessTagEditorComponent,
      onClose: () => onFetch(),
      buttons: [],
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
      onClose: () => onFetch(),
      buttons: [],
      data: {
        businessType: businessType,
        businessObject: businessObject,
      },
    });
  }

  onUserEditDialog(operationType: boolean, dialogDate: any, onFetch: Function, data: any, extend?: any) {
    const results = this.dialogService.open({
      ...dialogDate,
      id: 'user-edit',
      width: '40%',
      maxHeight: '1000px',
      backdropCloseable: false,
      dialogtype: 'standard',
      content: UserEditorComponent,
      onClose: () => onFetch(),
      buttons: [],
      data: {
        formData: data,
        operationType: operationType,
        ...extend
      },
    });
  }

  onRobotDialog(onFetch: Function, data: any) {
    const results = this.dialogService.open({
      title: 'New Robot',
      id: 'robot-edit',
      width: '70%',
      maxHeight: '800px',
      backdropCloseable: false,
      dialogtype: 'standard',
      content: RobotEditorComponent,
      onClose: () => onFetch(),
      buttons: [],
      data: {
        formData: data,
      },
    });
  }
}

export const DIALOG_DATA = {
  editorData: {
    id: 'editor-data',
    width: '30%',
    maxHeight: '800px',
    backdropCloseable: false,
    dialogtype: 'standard',
  },
  warningOperateData: {
    id: 'warning-operate',
    width: '346px',
    maxHeight: '800px',
    zIndex: 1050,
    backdropCloseable: true,
    html: true,
    dialogtype: 'warning',
  },
  content: {
    delete: '<strong>Confirm delete this row ?</strong>',
    inactive: '<strong>Confirm inactive this row ?</strong>',
    revoke: '<strong>Confirm revoke this row ?</strong>',
    scanAll: '<strong>Confirm scan all these row ?</strong>',
    unregister: '<strong>Confirm unregister ?</strong>',
    batchDelete: '<strong>Confirm delete these rows ?</strong>',
    batchValid: '<strong>Confirm update these rows ?</strong>',
    batchInactive: '<strong>Confirm inactive these rows ?</strong>',
    batchRevoke: '<strong>Confirm revoke these rows ?</strong>',
    deleteAll:  '<strong>Confirm delete all rows ?</strong>',
  }
}

export const ADD_OPERATION = true;
export const UPDATE_OPERATION = false;
