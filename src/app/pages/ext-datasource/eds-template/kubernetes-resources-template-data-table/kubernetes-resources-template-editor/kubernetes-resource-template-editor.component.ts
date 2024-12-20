import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import {
  KubernetesResourceTemplateEdit,
  KubernetesResourceTemplateVO,
} from '../../../../../@core/data/kubernetes-resource';
import { KubernetesResourceService } from '../../../../../@core/services/kubernetes-resource.service';

@Component({
  selector: 'app-kubernetes-resources-template-editor',
  templateUrl: './kubernetes-resource-template-editor.component.html',
  styleUrls: [ './kubernetes-resource-template-editor.component.less' ],
})
export class KubernetesResourceTemplateEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: KubernetesResourceTemplateVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    templateKey: {
      validators: [ { required: true } ],
      message: 'template key can not be null.',
    },
  };

  constructor(private kubernetesResourceService: KubernetesResourceService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: KubernetesResourceTemplateEdit = {
      ...this.formData,
    };
    return this.kubernetesResourceService.addTemplate(param);
  }

  updateForm() {
    const param: KubernetesResourceTemplateEdit = {
      ...this.formData,
    };
    return this.kubernetesResourceService.updateTemplate(param);
  }

  onCustomChange(custom: string, kubernetesResourceTemplateVO: KubernetesResourceTemplateVO) {
    kubernetesResourceTemplateVO.custom = custom;
  }

}
