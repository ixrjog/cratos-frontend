import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  KubernetesResourceMemberEdit,
  KubernetesResourceTemplateMemberVO,
  KubernetesResourceTemplateVO,
} from '../../../../../@core/data/kubernetes-resource';
import { DValidateRules } from 'ng-devui';
import { KubernetesResourceService } from '../../../../../@core/services/kubernetes-resource.service';
import { GroupPageQuery } from '../../../../../@core/data/rbac';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kubernetes-resources-member-editor',
  templateUrl: './kubernetes-resources-member-editor.component.html',
  styleUrls: [ './kubernetes-resources-member-editor.component.less' ],
})
export class KubernetesResourcesMemberEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: KubernetesResourceTemplateMemberVO;
  kubernetesResourceTemplate: KubernetesResourceTemplateVO;
  resourceKindOptions: [];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    namespace: {
      validators: [ { required: true } ],
      message: 'namespace can not be null.',
    },
    kind: {
      validators: [ { required: true } ],
      message: 'kind can not be null.',
    },
  };

  constructor(private kubernetesResourceService: KubernetesResourceService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.kubernetesResourceTemplate = this.data['kubernetesResourceTemplate'];
    this.formData.templateId = this.kubernetesResourceTemplate?.id;
    this.resourceKindOptions = this.data['resourceKindOptions'];
  }

  addForm() {
    const param: KubernetesResourceMemberEdit = {
      ...this.formData,
    };
    return this.kubernetesResourceService.addMember(param);
  }

  updateForm() {
    const param: KubernetesResourceMemberEdit = {
      ...this.formData,
    };
    return this.kubernetesResourceService.updateMember(param);
  }

  onCustomChange(custom: string, kubernetesResourceTemplateMemberVO: KubernetesResourceTemplateMemberVO) {
    kubernetesResourceTemplateMemberVO.custom = custom;
  }

  onContentChange(content: string, kubernetesResourceTemplateMemberVO: KubernetesResourceTemplateMemberVO) {
    kubernetesResourceTemplateMemberVO.content = content;
  }

  onSearchResourceTemplate = (term: string) => {
    const param: GroupPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.kubernetesResourceService.queryTemplatePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((template, index) => ({ id: index, option: template })),
        ),
      );
  };

  onResourceTemplateChange(templateVO: KubernetesResourceTemplateVO) {
    this.kubernetesResourceTemplate = templateVO;
    this.formData.templateId = templateVO.id;
  }

}
