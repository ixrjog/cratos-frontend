import { Component, Input, OnInit } from '@angular/core';
import { DValidateRules } from 'ng-devui';
import { FormLayout } from 'ng-devui/form';
import { EdsInstanceVO, RegisterInstance } from '../../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';

@Component({
  selector: 'app-eds-instance-editor',
  templateUrl: './eds-instance-editor.component.html',
  styleUrls: [ './eds-instance-editor.component.less' ],
})
export class EdsInstanceEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input()
  data: any;
  formData: EdsInstanceVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    instanceName: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private edsService: EdsService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    console.log(this.formData)
  }

  addForm() {
    const param: RegisterInstance = {
      ...this.formData,
    };
    return this.edsService.registerEdsInstance(param);
  }

  updateForm() {
  }

  protected readonly JSON = JSON;
}
