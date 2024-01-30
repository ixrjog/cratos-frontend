import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules, SplitterOrientation, ToastService } from 'ng-devui';
import { TagService } from '../../../../@core/services/tag.service';
import { BusinessTagService } from '../../../../@core/services/business-tag.service';
import { TagPageQuery, TagVo } from '../../../../@core/data/tag';
import { BusinessTagEdit, BusinessTagVo, GetByBusiness, ListValue } from '../../../../@core/data/business-tag';
import { map } from 'rxjs/operators';
import { DIALOG_DATA, DialogUtil } from '../../../utils/dialog.util';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-business-tag-editor',
  templateUrl: './business-tag-editor.component.html',
  styleUrls: [ './business-tag-editor.component.less' ],
})
export class BusinessTagEditorComponent implements OnInit {

  size = '30%';
  minSize = '20%';
  maxSize = '60%';
  loading: boolean = false;

  businessTags: BusinessTagVo[];
  orientation: SplitterOrientation = 'horizontal';
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input()
  data: any;
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
      // asyncValidators: [{ sameName: this.checkName.bind(this), message: {
      //     'zh-cn': '用户名重名',
      //     'en-us': 'Duplicate name.'
      //   }
      // }],
    },
    tagValue: {
      validators: [ { required: true }, { minlength: 1 }, { maxlength: 150 }, { pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/ } ],
      message: 'Enter a value that contains 1 to 15 digits and letters.',
    },
  };

  constructor(
    private tagService: TagService,
    private businessTagService: BusinessTagService,
    private dialogUtil: DialogUtil,
    private toastService: ToastService) {
  }

  onSearchTag = (term: string) => {
    const param: TagPageQuery = {
      length: 20, page: 1, tagKey: term,
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

  onTagChange(tag: TagVo) {
    this.formData.tagValue = '';
    this.onSearchTagValue('');
  }

  ngOnInit(): void {
    this.businessType = this.data.businessType;
    this.queryBusinessTagByBusiness();
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: BusinessTagEdit = {
        businessId: this.data.businessObject.id,
        businessType: this.businessType,
        tagId: this.formData.tag['id'],
        tagValue: this.formData.tagValue,
      };
      this.businessTagService.saveBusinessTag(param)
        .subscribe(() => {
          this.queryBusinessTagByBusiness();
        });
    } else {
      console.log(directive);
    }
  }

  queryBusinessTagByBusiness() {
    this.loading = true;
    const param: GetByBusiness = {
      businessId: this.data.businessObject.id,
      businessType: this.businessType,
    };
    this.businessTagService.queryBusinessTagByBusiness(param)
      .subscribe(({ body }) => {
        this.businessTags = body;
        this.loading = false;
      });
  }

  onBeforeDelete(tag: BusinessTagVo): Observable<boolean> {
    return this.businessTagService.deleteBusinessTagById({ id: tag.id })
      .pipe(map(({ success }) => success));
  };

  onTagDelete(tag: BusinessTagVo) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.businessTagService.deleteBusinessTagById({ id: tag.id })
        .subscribe(() => {
          this.toastService.open({
            value: [ { severity: 'success', summary: 'Success', content: 'Delete Success' } ],
            life: 2000,
          });
          this.queryBusinessTagByBusiness();
        });
    });
  }
}
