import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CertificateEdit, CertificateVo } from 'src/app/@core/data/certificate';
import { CertificateService } from '../../../../../@core/services/certificate.service';
import { DatePipe, DValidateRules } from 'ng-devui';
import * as ace from "ace-builds";

@Component({
  selector: 'app-certificate-editor',
  templateUrl: './certificate-editor.component.html',
  styleUrls: [ './certificate-editor.component.less' ],
})
export class CertificateEditorComponent implements OnInit {

  @ViewChild('certificateEditorForm') userFormDir: DFormGroupRuleDirective;

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input()
  data: any;
  formData: CertificateVo;
  certificateFormGroup: FormGroup;
  operationType: boolean;

  certificateTypeOptions = [
    'AWS', 'ALIYUN',
  ];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    certificateId: { validators: [ { required: true } ] },
    name: {
      validators: [
        { required: true },
        { minlength: 3 },
        { maxlength: 128 },
        {
          pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
          message: 'The name cannot contain characters except uppercase and lowercase letters.',
        },
      ],
    },
    domainName: { validators: [ { required: true } ] },
    certificateType: { validators: [ { required: true } ] },
  };

  constructor(
    private certificateService: CertificateService,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.certificateFormGroup = new UntypedFormGroup({
      id: new UntypedFormControl(this.formData.id ? this.formData.id : null),
      certificateId: new UntypedFormControl(this.formData.certificateId),
      name: new UntypedFormControl(this.formData.name),
      domainName: new UntypedFormControl(this.formData.domainName),
      certificateType: new UntypedFormControl(this.formData.certificateType),
      keyAlgorithm: new UntypedFormControl(this.formData.keyAlgorithm),
      valid: new UntypedFormControl(this.formData.valid),
      notBefore: new UntypedFormControl(this.formData.notBefore),
      notAfter: new UntypedFormControl(this.formData.notAfter),
      comment: new UntypedFormControl(this.formData.comment),
    });
  }

  addForm() {
    const param: CertificateEdit = {
      ...this.certificateFormGroup.value,
      notBefore: Date.parse(this.certificateFormGroup.get('notBefore').value),
      notAfter: Date.parse(this.certificateFormGroup.get('notAfter').value),
    };
    return this.certificateService.addCertificate(param);
  }

  updateForm() {
    const param: CertificateEdit = {
      ...this.certificateFormGroup.value,
      notBefore: Date.parse(this.certificateFormGroup.get('notBefore').value),
      notAfter: Date.parse(this.certificateFormGroup.get('notAfter').value),
    };
    return this.certificateService.updateCertificate(param);
  }

}

