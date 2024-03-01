import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EdsInstanceVO } from '../../../../../@core/data/ext-datasource';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import {
  EdsConfigEditorComponent,
} from '../../../eds-config/eds-config-data-table/eds-config-editor/eds-config-editor.component';
import { EdsInstanceEditorComponent } from '../eds-instance-editor/eds-instance-editor.component';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { getRowColor } from '../../../../../@shared/utils/data-table.utli';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eds-instance-card',
  templateUrl: './eds-instance-card.component.html',
  styleUrls: [ './eds-instance-card.component.less' ],
})
export class EdsInstanceCardComponent {

  @Input()
  edsInstance: EdsInstanceVO;

  businessType: string = BusinessTypeEnum.EDS_INSTANCE;

  @Output()
  onFetchData = new EventEmitter<string>();


  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: EdsConfigEditorComponent,
    },
    editorInstanceData: {
      ...DIALOG_DATA.editorData,
      content: EdsInstanceEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private route: Router,
    private edsService: EdsService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  onRowConfigEdit(rowItem: EdsInstanceVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Eds Config',
      width: '50%',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.onFetchData.emit();
    }, rowItem.edsConfig);
  }

  onRowInstanceEdit(rowItem: EdsInstanceVO) {
    const dialogDate = {
      ...this.dialogDate.editorInstanceData,
      title: 'Edit Eds Instance',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.onFetchData.emit();
    }, rowItem);
  }

  onRowValid(rowItem: EdsInstanceVO) {
    this.edsService.setEdsInstanceValidById({ id: rowItem.id })
      .subscribe(() => {
        this.onFetchData.emit();
      });
  }

  onRowDelete(rowItem: EdsInstanceVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.edsService.deleteEdsInstanceById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData.emit();
        });
    });
  }

  onRowBusinessTag(rowItem: EdsInstanceVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.onFetchData.emit());
  }

  onRowBusinessDoc(rowItem: EdsInstanceVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.onFetchData.emit());
  }

  protected readonly getRowColor = getRowColor;

  onclick() {
    this.route.navigate(['/pages/sys/tag',]);
  }

}
