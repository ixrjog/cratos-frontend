import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { GlobalNetworkService } from '../../../../../@core/services/global-network.service';
import { NetworkDetails } from '../../../../../@core/data/global-network';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-global-network-details',
  templateUrl: './global-network-details.component.html',
  styleUrls: [ './global-network-details.component.less' ],
})
export class GlobalNetworkDetailsComponent implements AfterViewInit {

  loading = false;
  showRecord = false;
  globalNetworkDetails: NetworkDetails;
  networkId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private globalNetworkService: GlobalNetworkService) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      this.networkId = param['networkId'];
      if (this.networkId) {
        this.fetchData();
      }
    });
  }

  fetchData() {
    this.showRecord = true;
    this.loading = true;
    this.globalNetworkService.queryGlobalNetworkDetails({ id: this.networkId })
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.globalNetworkDetails = body;
      });
  }

  protected readonly JSON = JSON;

}
