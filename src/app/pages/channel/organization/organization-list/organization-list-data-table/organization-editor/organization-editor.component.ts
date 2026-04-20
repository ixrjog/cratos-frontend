import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { OrganizationEdit, OrganizationVO } from '../../../../../../@core/data/organization';
import { OrganizationService } from '../../../../../../@core/services/organization.service';

@Component({
  selector: 'app-organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.less'],
})
export class OrganizationEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: OrganizationVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [{ required: true }],
      message: 'name can not be null.',
    },
    code: {
      validators: [{ required: true }],
      message: 'code can not be null.',
    },
  };

  constructor(private organizationService: OrganizationService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: OrganizationEdit = { ...this.formData };
    return this.organizationService.addOrganization(param);
  }

  updateForm() {
    const param: OrganizationEdit = { ...this.formData };
    return this.organizationService.updateOrganization(param);
  }
}
