import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules, SplitterOrientation } from 'ng-devui';
import { TagService } from '../../../../@core/services/tag.service';
import { BusinessTagService } from '../../../../@core/services/business-tag.service';
import { TagPageQuery } from '../../../../@core/data/tag';
import { ListValue } from '../../../../@core/data/business-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-business-tag-editor',
  templateUrl: './business-tag-editor.component.html',
  styleUrls: [ './business-tag-editor.component.less' ],
})
export class BusinessTagEditorComponent implements OnInit {

  size = '30%';
  minSize = '20%';
  maxSize = '60%';

  orientation: SplitterOrientation = 'horizontal';
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input()
  data: any;

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
      validators: [ { required: true }, { minlength: 1 }, { maxlength: 15 }, { pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/ } ],
      message: 'Enter a password that contains 1 to 15 digits and letters.',
    },
  };

  constructor(
    private tagService: TagService,
    private businessTagService: BusinessTagService) {
  }

  onSearchTag = (term: string) => {
    this.formData.tagValue = term
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
          body.map((businessTag, index) =>
            ({ label: businessTag.tagValue, id: index })),
        ),
      );
  };

  ngOnInit(): void {
  }

  submitForm({ valid, directive }) {
    console.log('valid');
    console.log(valid);
    console.log('directive');
    console.log(directive);
  }


}
