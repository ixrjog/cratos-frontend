import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { RbacGroupEdit, RbacGroupVO } from '../../../../../@core/data/rbac';
import { DValidateRules } from 'ng-devui';
import { RbacService } from '../../../../../@core/services/rbac.service';
import { TrafficLayerService } from '../../../../../@core/services/traffic-layer.service';
import { TrafficLayerDomainEdit, TrafficLayerDomainVO } from '../../../../../@core/data/traffic-layer';

@Component({
  selector: 'app-traffic-layer-domain-editor',
  templateUrl: './traffic-layer-domain-editor.component.html',
  styleUrls: ['./traffic-layer-domain-editor.component.less']
})
export class TrafficLayerDomainEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: TrafficLayerDomainVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    domain: {
      validators: [ { required: true } ],
      message: 'domain can not be null.',
    },
  };

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }


  addForm() {
    const param: TrafficLayerDomainEdit = {
      ...this.formData,
    };
    return this.trafficLayerService.addTrafficLayerDomain(param);
  }

  updateForm() {
    const param: TrafficLayerDomainEdit = {
      ...this.formData,
    };
    return this.trafficLayerService.updateTrafficLayerDomain(param);
  }

}
