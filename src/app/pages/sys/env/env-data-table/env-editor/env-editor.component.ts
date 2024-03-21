import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { EnvEdit, EnvVO } from '../../../../../@core/data/env';
import { EnvService } from '../../../../../@core/services/env.service';

@Component({
  selector: 'app-env-editor',
  templateUrl: './env-editor.component.html',
  styleUrls: [ './env-editor.component.less' ],
})
export class EnvEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: EnvVO;

  promptColorOptions = [
    'BLACK',
    'RED',
    'GREEN',
    'YELLOW',
    'BLUE',
    'MAGENTA',
    'CYAN',
    'WHITE',
    'BRIGHT',
  ];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    envName: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private envService: EnvService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: EnvEdit = {
      ...this.formData,
    };
    return this.envService.addEnv(param);
  }

  updateForm() {
    const param: EnvEdit = {
      ...this.formData,
    };
    return this.envService.updateTag(param);
  }

}
