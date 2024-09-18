import { Component, Input, OnInit } from '@angular/core';
import { DValidateRules } from 'ng-devui';
import { FormLayout } from 'ng-devui/form';
import { map } from 'rxjs/operators';
import { RbacService } from '../../../../../@core/services/rbac.service';
import { GroupPageQuery, RbacGroupVO, RbacResourceEdit, RbacResourceVO } from '../../../../../@core/data/rbac';

@Component({
  selector: 'app-rbac-resource-editor',
  templateUrl: './rbac-resource-editor.component.html',
  styleUrls: ['./rbac-resource-editor.component.less']
})
export class RbacResourceEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: RbacResourceVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private rbacService: RbacService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  onSearchRbacGroup = (term: string) => {
    const param: GroupPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.rbacService.queryGroupPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((group, index) => ({ id: index, option: group })),
        ),
      );
  };

  onRbacGroupChange(rbacGroupVO: RbacGroupVO) {
    this.formData.groupId = rbacGroupVO.id;
  }

  updateForm() {
    const param: RbacResourceEdit = {
      ...this.formData,
    };
    return this.rbacService.updateResource(param);
  }

}
