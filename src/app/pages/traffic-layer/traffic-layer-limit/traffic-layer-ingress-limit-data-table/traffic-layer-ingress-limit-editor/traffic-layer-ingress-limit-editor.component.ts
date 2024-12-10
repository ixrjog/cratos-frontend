import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import {
  TrafficLayerIngressTrafficLimitVO,
  UpdateTrafficLayerIngressTrafficLimit,
} from '../../../../../@core/data/traffic-layer';
import { TrafficLayerService } from '../../../../../@core/services/traffic-layer.service';

@Component({
  selector: 'app-traffic-layer-ingress-limit-editor',
  templateUrl: './traffic-layer-ingress-limit-editor.component.html',
  styleUrls: [ './traffic-layer-ingress-limit-editor.component.less' ],
})
export class TrafficLayerIngressLimitEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: TrafficLayerIngressTrafficLimitVO;
  limitQps: number;
  commitMsg: string;
  min: number = 0;
  max: number = 100000;
  step: number = 100;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    limit: {
      validators: [ { required: true } ],
      message: 'limit can not be null.',
    },
  };

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    if (this.formData.trafficLimitQps?.value) {
      this.limitQps = Number(this.formData.trafficLimitQps.value);
    } else {
      this.limitQps = 0;
    }
  }

  updateForm() {
    const param: UpdateTrafficLayerIngressTrafficLimit = {
      assetId: this.formData.asset.id,
      limitQps: this.limitQps,
      commit: {
        message: this.commitMsg,
      },
    };
    return this.trafficLayerService.updateIngressTrafficLimit(param);
  }

}
