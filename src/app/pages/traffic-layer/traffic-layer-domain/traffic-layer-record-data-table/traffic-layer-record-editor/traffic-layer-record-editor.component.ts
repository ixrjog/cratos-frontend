import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordEdit,
  TrafficLayerRecordVO,
} from '../../../../../@core/data/traffic-layer';
import { DValidateRules } from 'ng-devui';
import { TrafficLayerService } from '../../../../../@core/services/traffic-layer.service';
import { map } from 'rxjs/operators';
import { EnvPageQuery, EnvVO } from '../../../../../@core/data/env';
import { EnvService } from '../../../../../@core/services/env.service';

@Component({
  selector: 'app-traffic-layer-record-editor',
  templateUrl: './traffic-layer-record-editor.component.html',
  styleUrls: ['./traffic-layer-record-editor.component.less']
})
export class TrafficLayerRecordEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: TrafficLayerRecordVO;
  domain: TrafficLayerDomainVO;
  env: EnvVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    recordName: {
      validators: [ { required: true } ],
      message: 'recordName can not be null.',
    },
    originServer: {
      validators: [ { required: true } ],
      message: 'originServer can not be null.',
    },
  };

  constructor(private trafficLayerService: TrafficLayerService,
              private envService: EnvService,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: TrafficLayerRecordEdit = {
      ...this.formData,
    };
    return this.trafficLayerService.addTrafficLayerRecord(param);
  }

  onSearchDomain = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.trafficLayerService.queryTrafficLayerDomainPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((domain, index) => ({ id: index, option: domain })),
        ),
      );
  };

  onDomainChange(domain: TrafficLayerDomainVO) {
    this.formData.domainId = domain.id;
  }

  onSearchEnv = (term: string) => {
    const param: EnvPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.envService.queryEnvPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((env, index) => ({ id: index, option: env })),
        ),
      );
  };

  onEnvChange(env: EnvVO) {
    this.formData.envName = env.envName;
  }
}
