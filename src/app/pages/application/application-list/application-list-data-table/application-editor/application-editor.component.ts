import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { ApplicationEdit, ApplicationVO } from '../../../../../@core/data/application';
import { ApplicationService } from '../../../../../@core/services/application.service';

@Component({
  selector: 'app-application-editor',
  templateUrl: './application-editor.component.html',
  styleUrls: [ './application-editor.component.less' ],
})
export class ApplicationEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ApplicationVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: ApplicationEdit = {
      ...this.formData,
    };
    return this.applicationService.addApplication(param);
  }

  updateForm() {
    const param: ApplicationEdit = {
      ...this.formData,
    };
    return this.applicationService.updateApplication(param);
  }

  onConfigChange(config: string, applicationVO: ApplicationVO) {
    applicationVO.config = config;
  }

}
