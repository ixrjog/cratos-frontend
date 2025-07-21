import { Component, Input, OnInit } from '@angular/core';
import { GlobalNetworkVO, NetworkInfoVO } from '../../../../../@core/data/global-network';
import { GlobalNetworkService } from '../../../../../@core/services/global-network.service';

@Component({
  selector: 'app-global-network-check-cidr',
  templateUrl: './global-network-check-cidr.component.html',
  styleUrls: [ './global-network-check-cidr.component.less' ],
})
export class GlobalNetworkCheckCidrComponent implements OnInit {

  globalNetworkList: GlobalNetworkVO[] = [];
  networkInfo: NetworkInfoVO;
  globalNetwork: GlobalNetworkVO;
  @Input() data: any;

  constructor(private globalNetworkService: GlobalNetworkService) {
  }

  ngOnInit(): void {
    this.globalNetwork = this.data['globalNetwork'];
    if (JSON.stringify(this.globalNetworkList) === '[]') {
      this.onCheckCidrBlock();
    }
    this.onGetNetworkInfo();
  }

  protected readonly JSON = JSON;

  onCheckCidrBlock() {
    this.globalNetworkList = [];
    this.globalNetworkService.checkGlobalNetworkByCidrBlock({ cidrBlock: this.globalNetwork.cidrBlock })
      .subscribe(({ body }) => this.globalNetworkList = body);
  }

  onGetNetworkInfo() {
    this.networkInfo = null;
    this.globalNetworkService.calcNetwork({ cidr: this.globalNetwork.cidrBlock })
      .subscribe(({ body }) => this.networkInfo = body);

  }

}
