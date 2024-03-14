import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { RbacGroupEdit, RbacGroupVO, RbacRoleEdit, RbacRoleVO } from '../../../../../@core/data/rbac';
import { DValidateRules } from 'ng-devui';
import { RbacService } from '../../../../../@core/services/rbac.service';

@Component({
  selector: 'app-rbac-role-editor',
  templateUrl: './rbac-role-editor.component.html',
  styleUrls: ['./rbac-role-editor.component.less']
})
export class RbacRoleEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: RbacRoleVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    roleName: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    }
  };

  constructor(private rbacService: RbacService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: RbacRoleEdit = {
      ...this.formData,
    };
    return this.rbacService.addRole(param);
  }

  updateForm() {
    const param: RbacRoleEdit = {
      ...this.formData,
    };
    return this.rbacService.updateRole(param);
  }

}
