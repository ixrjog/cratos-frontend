import { Component, OnInit } from '@angular/core';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-traffic-layer-ingress-detail',
  templateUrl: './traffic-layer-ingress-detail.component.html',
  styleUrls: [ './traffic-layer-ingress-detail.component.less' ],
})
export class TrafficLayerIngressDetailComponent implements OnInit {

  loading = false;
  showRecord = false;
  queryParam = {
    queryHost: '',
    name: '',
  };
  tableDetails: string = '';
  nameOptions: string[] = [];

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnInit(): void {
    this.showRecord = false;
  }

  fetchData() {
    this.showRecord = true;
    this.loading = true;
    this.tableDetails = '';
    if (!this.queryParam.name) {
      this.nameOptions = [];
      this.trafficLayerService.queryIngressHostDetails({ queryHost: this.queryParam.queryHost })
        .pipe(
          finalize(() => this.loading = false),
        )
        .subscribe(({ body }) => {
          this.tableDetails = body.ingressTable;
          this.nameOptions = body.names;
        });
    } else {
      this.trafficLayerService.queryIngressDetails({ name: this.queryParam.name })
        .pipe(
          finalize(() => this.loading = false),
        )
        .subscribe(({ body }) => {
          this.tableDetails = body.ingressTable;
        });
    }
  }

  protected readonly JSON = JSON;
}
