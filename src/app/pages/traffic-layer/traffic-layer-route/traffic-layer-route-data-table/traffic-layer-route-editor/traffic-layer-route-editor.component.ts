import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordPageQuery,
  TrafficLayerRecordVO,
} from '../../../../../@core/data/traffic-layer';
import { DValidateRules } from 'ng-devui';
import { map } from 'rxjs/operators';
import { TrafficRouteService } from '../../../../../@core/services/traffic-route.service';
import { TrafficLayerService } from '../../../../../@core/services/traffic-layer.service';
import { TrafficRouteEdit, TrafficRouteVO } from '../../../../../@core/data/traffic-route';
import { EdsInstanceVO, InstancePageQuery } from '../../../../../@core/data/ext-datasource';

@Component({
  selector: 'app-traffic-layer-route-editor',
  templateUrl: './traffic-layer-route-editor.component.html',
  styleUrls: ['./traffic-layer-route-editor.component.less']
})
export class TrafficLayerRouteEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: TrafficRouteVO;
  trafficLayerDomain: TrafficLayerDomainVO;
  trafficLayerRecord: TrafficLayerRecordVO;
  dnsResolverInstance: EdsInstanceVO;
  operationType: boolean;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    originServer: {
      validators: [ { required: true } ],
      message: 'originServer can not be null.',
    },
  };

  constructor(
    private trafficRouteService: TrafficRouteService,
    private trafficLayerService: TrafficLayerService,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.operationType = this.data['operationType'];
    this.dnsResolverInstance = this.formData['dnsResolverInstance'];
  }

  addForm() {
    const param: TrafficRouteEdit = {
      ...this.formData,
    };
    return this.trafficRouteService.addTrafficRoute(param);
  }

  updateForm() {
    const param: TrafficRouteEdit = {
      ...this.formData,
    };
    return this.trafficRouteService.updateTrafficRoute(param);
  }

  onSearchDomain = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.trafficLayerService.queryTrafficLayerDomainPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((domain, index) => ({ id: index, option: domain })),
        ),
      );
  };

  onDomainChange(domain: TrafficLayerDomainVO) {
    this.onSearchDomainRecord('');
    this.formData.domainId = domain.id;
    this.formData.domain = domain.registeredDomain;
  }

  onSearchDomainRecord = (term: string) => {
    const param: TrafficLayerRecordPageQuery = {
      length: 10, page: 1, domainId: this.trafficLayerDomain.id, hasRouteTrafficTo: null, queryName: term,
    };
    return this.trafficLayerService.queryTrafficLayerRecordPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((domainRecord, index) => ({ id: index, option: domainRecord })),
        ),
      );
  };

  onDomainRecordChange(domainRecord: TrafficLayerRecordVO) {
    this.formData.domainRecordId = domainRecord.id;
    this.formData.domainRecord = domainRecord.recordName;
  }

  onSearchDnsResolverInstance = (term: string) => {
    return this.trafficRouteService.queryDnsResolverInstances()
      .pipe(
        map(({ body }) =>
          body.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onDnsResolverInstanceChange(instance: EdsInstanceVO) {
    this.formData.dnsResolverInstanceId = instance.id;
  }

  protected readonly JSON = JSON;
}
