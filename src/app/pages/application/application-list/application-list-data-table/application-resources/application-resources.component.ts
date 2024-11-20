import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from '../../../../../@core/services/application.service';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-application-resources',
  templateUrl: './application-resources.component.html',
  styleUrls: [ './application-resources.component.less' ],
})
export class ApplicationResourcesComponent {

  private _resources: any;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  @Output() onFetchData = new EventEmitter<any>();
  @Input()
  set resources(value) {
    this._resources = JSON.parse(JSON.stringify(value));
  }
  get resources() {
    return this._resources;
  }

  constructor(
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  onShowName(value) {
    switch (value.resourceType) {
      case 'GITLAB_PROJECT':
        return value.displayName;
      case 'KUBERNETES_DEPLOYMENT':
      case 'KUBERNETES_SERVICE':
        return value.displayName + '@' + value.instanceName;
      default:
        return value.displayName;
    }
  }

  onDeleteTag(tag) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.applicationService.deleteApplicationResourceById({ id: tag.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData.emit();
        });
    });
  }

}
