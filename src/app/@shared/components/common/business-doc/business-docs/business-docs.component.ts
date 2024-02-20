import { Component, OnInit } from '@angular/core';
import { BusinessDocEdit, BusinessDocVO } from '../../../../../@core/data/business-doc';
import { BusinessDocService } from '../../../../../@core/services/business-doc.service';
import { DIALOG_DATA, DialogUtil } from '../../../../utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../utils/toast.util';
import { GetByBusiness } from '../../../../../@core/data/business';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-business-docs',
  templateUrl: './business-docs.component.html',
  styleUrls: [ './business-docs.component.less' ],
})
export class BusinessDocsComponent implements OnInit {

  loading: boolean = false;
  data: any;
  businessType: string;
  businessDocs: BusinessDocVO[];
  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private businessDocService: BusinessDocService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.businessType = this.data.businessType;
    this.queryBusinessDocByBusiness();
  }

  queryBusinessDocByBusiness() {
    this.loading = true
    this.businessDocs = [];
    const param: GetByBusiness = {
      businessId: this.data.businessObject.id,
      businessType: this.businessType,
    };
    this.businessDocService.queryBusinessDocByBusiness(param)
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.businessDocs = body;
      });
  }

  onAddBusinessDoc() {
    const param: BusinessDocEdit = {
      businessId: this.data.businessObject.id,
      businessType: this.businessType,
      comment: 'emmmmm',
      content: 'Nothing written',
      documentType: 'MARKDOWN',
      name: 'New doc',
      seq: 0,
    };
    this.businessDocService.addBusinessDoc(param)
      .subscribe(() => this.queryBusinessDocByBusiness());
  }

  onUpdateBusinessDoc(businessDoc: BusinessDocVO) {
    const param: BusinessDocEdit = {
      ...businessDoc,
    };
    this.businessDocService.updateBusinessDoc(param)
      .subscribe(() => {
        businessDoc['$edit'] = false;
        this.queryBusinessDocByBusiness();
        this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
      });
  }

  onDeleteBusinessDoc(businessDoc: BusinessDocVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.businessDocService.deleteBusinessDocById({ id: businessDoc.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.queryBusinessDocByBusiness();
        });
    });
  }

  onCanEdit(businessDoc: BusinessDocVO) {
    businessDoc['$edit'] = true;
  }

  protected readonly JSON = JSON;
}
