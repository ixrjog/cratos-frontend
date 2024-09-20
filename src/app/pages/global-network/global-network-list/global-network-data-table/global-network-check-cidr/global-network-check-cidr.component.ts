import { Component, Input, OnInit } from '@angular/core';
import { GlobalNetworkVO } from '../../../../../@core/data/global-network';

@Component({
  selector: 'app-global-network-check-cidr',
  templateUrl: './global-network-check-cidr.component.html',
  styleUrls: [ './global-network-check-cidr.component.less' ],
})
export class GlobalNetworkCheckCidrComponent implements OnInit {

  @Input() globalNetworkList: GlobalNetworkVO[] = [];
  @Input() data: any;

  ngOnInit(): void {
    if (JSON.stringify(this.globalNetworkList) === '[]') {
      this.globalNetworkList = this.data['globalNetworkList'];
    }
  }

  protected readonly JSON = JSON;
}
