import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { RbacGroupEdit, RbacGroupVO } from '../../../../../@core/data/rbac';
import { RbacService } from '../../../../../@core/services/rbac.service';

@Component({
  selector: 'app-rbac-group-editor',
  templateUrl: './rbac-group-editor.component.html',
  styleUrls: ['./rbac-group-editor.component.less']
})
export class RbacGroupEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: RbacGroupVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    groupName: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    base: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private rbacService: RbacService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  updateForm() {
    const param: RbacGroupEdit = {
      ...this.formData,
    };
    return this.rbacService.updateGroup(param);
  }

}
