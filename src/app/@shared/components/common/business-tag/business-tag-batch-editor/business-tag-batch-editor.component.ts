import { Component, Input, OnInit } from '@angular/core';
import { DValidateRules } from 'ng-devui';
import { BusinessTagEdit, ListValue } from '../../../../../@core/data/business-tag';
import { FormLayout } from 'ng-devui/form';
import { DIALOG_DATA } from '../../../../utils/dialog.util';
import { TagService } from '../../../../../@core/services/tag.service';
import { BusinessTagService } from '../../../../../@core/services/business-tag.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../utils/toast.util';
import { TagPageQuery, TagVO } from '../../../../../@core/data/tag';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-business-tag-batch-editor',
  templateUrl: './business-tag-batch-editor.component.html',
  styleUrls: [ './business-tag-batch-editor.component.less' ],
})
export class BusinessTagBatchEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  businessType: string;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  formData = {
    tag: {},
    tagValue: '',
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    tagKey: {
      validators: [ { required: true } ],
    },
  };

  constructor(
    private tagService: TagService,
    private businessTagService: BusinessTagService,
    private toastUtil: ToastUtil) {
  }

  onSearchTag = (term: string) => {
    const param: TagPageQuery = {
      length: 10, page: 1, tagKey: term,
    };
    return this.tagService.queryTagPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((tag, index) => ({ id: index, option: tag })),
        ),
      );
  };

  onSearchTagValue = (term: string) => {
    const param: ListValue = {
      queryTagValue: term, tagId: this.formData.tag['id'],
    };
    return this.businessTagService.queryBusinessTagByValue(param)
      .pipe(
        map(({ body }) =>
          body.map((tagValue, index) =>
            ({ label: tagValue, id: index })),
        ),
      );
  };

  valueParser($event) {
    return $event['label'];
  }

  onTagChange(tag: TagVO) {
    this.formData.tagValue = '';
    this.onSearchTagValue('');
  }

  ngOnInit(): void {
    this.businessType = this.data.businessType;
  }

  onBatchBind() {
    if (JSON.stringify(this.data.businessObjects) !== '[]') {
      Promise.all(this.data.businessObjects.map(businessObject => this.onSaveBusinessTag(businessObject.id)))
        .then(results => {
          if (results.every(result => result.success)) {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
          }
        });
    } else {
      this.toastUtil.onErrorToast('No data selected');
    }
  }

  onSaveBusinessTag(businessId: number): Promise<any> {
    const param: BusinessTagEdit = {
      businessId: businessId,
      businessType: this.businessType,
      tagId: this.formData.tag['id'],
      tagValue: this.formData.tagValue,
    };
    return firstValueFrom(this.businessTagService.saveBusinessTag(param));
  }
}
