import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { CopyTemplate, KubernetesResourceTemplateVO } from '../../../../../@core/data/kubernetes-resource';
import { DValidateRules } from 'ng-devui';
import { KubernetesResourceService } from '../../../../../@core/services/kubernetes-resource.service';

@Component({
  selector: 'app-kubernetes-resource-template-clone',
  templateUrl: './kubernetes-resource-template-clone.component.html',
  styleUrls: [ './kubernetes-resource-template-clone.component.less' ],
})
export class KubernetesResourceTemplateCloneComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: CopyTemplate = {
    templateId: null, templateKey: '', templateName: '',
  };
  kubernetesResourceTemplate: KubernetesResourceTemplateVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    templateName: {
      validators: [ { required: true } ],
      message: 'template name can not be null.',
    },
    templateKey: {
      validators: [ { required: true } ],
      message: 'template key can not be null.',
    },
  };

  constructor(private kubernetesResourceService: KubernetesResourceService) {
  }

  ngOnInit(): void {
    this.kubernetesResourceTemplate = this.data['formData'];
    this.formData.templateId = this.kubernetesResourceTemplate.id;
  }

  addForm() {
    const param: CopyTemplate = {
      ...this.formData,
    };
    return this.kubernetesResourceService.copyTemplate(param);
  }

}
