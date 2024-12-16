import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  CreateResourceByTemplate,
  KubernetesResourceTemplateInstanceVO,
  KubernetesResourceTemplateVO,
} from '../../../../../@core/data/kubernetes-resource';
import { DValidateRules } from 'ng-devui';
import { KubernetesResourceService } from '../../../../../@core/services/kubernetes-resource.service';

@Component({
  selector: 'app-kubernetes-resource-create',
  templateUrl: './kubernetes-resource-create.component.html',
  styleUrls: [ './kubernetes-resource-create.component.less' ],
})
export class KubernetesResourceCreateComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: KubernetesResourceTemplateVO;
  namespaceOptions = [];
  kindOptions = [];
  instanceOptions: KubernetesResourceTemplateInstanceVO[] = [];
  selectedInstances: KubernetesResourceTemplateInstanceVO[] = [];

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
    this.kindOptions = this.formData.kinds
    this.namespaceOptions = this.formData.namespaces
    this.instanceOptions = this.formData.instances;
    this.selectedInstances = this.instanceOptions
      .filter((instance) => instance.selected);
  }

  addForm() {
    const param: CreateResourceByTemplate = {
      templateId: this.formData.id,
      custom: this.formData.custom,
      namespaces: this.formData.namespaces,
      kinds: this.formData.kinds,
      instances: this.selectedInstances.map(instance => instance.id),
    };
    return this.kubernetesResourceService.createResourceByTemplate(param);
  }

  onCustomChange(custom: string, kubernetesResourceTemplateVO: KubernetesResourceTemplateVO) {
    kubernetesResourceTemplateVO.custom = custom;
  }

  protected readonly JSON = JSON;
}
