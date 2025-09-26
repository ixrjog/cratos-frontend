import { Component, OnInit } from '@angular/core';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-traffic-layer-ingress-service-detail',
  templateUrl: './traffic-layer-ingress-service-detail.component.html',
  styleUrls: ['./traffic-layer-ingress-service-detail.component.less']
})
export class TrafficLayerIngressServiceDetailComponent implements OnInit {

  loading = false;
  showRecord = false;
  queryParam = {
    queryService: '',
  };
  tableDetails: string = '';

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnInit(): void {
    this.showRecord = false;
  }

  fetchData() {
    this.showRecord = true;
    this.loading = true;
    this.tableDetails = '';
    this.trafficLayerService.queryIngressServiceDetails({ queryService: this.queryParam.queryService })
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.tableDetails = body.ingressTable;
      });
  }

  protected readonly JSON = JSON;
}
