import { Component, OnInit } from '@angular/core';
import { DatacenterService } from '../../../@core/services/datacenter.service';
import { DialogService } from 'ng-devui';
import { SubnetBlockDetailComponent } from './subnet-block-detail/subnet-block-detail.component';

@Component({
  selector: 'app-datacenter-subnet-map',
  templateUrl: './datacenter-subnet-map.component.html',
  styleUrls: ['./datacenter-subnet-map.component.less'],
})
export class DatacenterSubnetMapComponent implements OnInit {

  subnetMap: any = null;
  loading = false;
  parentCidr = '10.0.0.0/8';
  prefixLength = 16;

  parentCidrOptions = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

  prefixLengthMap = {
    '10.0.0.0/8': [16, 17, 18],
    '172.16.0.0/12': [16, 17, 18, 19, 20],
    '192.168.0.0/16': [18, 19, 20, 21, 22, 23, 24],
  };

  constructor(private datacenterService: DatacenterService, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.fetchData();
  }

  getAvailablePrefixLengths(): number[] {
    return this.prefixLengthMap[this.parentCidr] || [16];
  }

  onParentCidrChange(cidr: string) {
    this.parentCidr = cidr;
    const available = this.getAvailablePrefixLengths();
    if (!available.includes(this.prefixLength)) {
      this.prefixLength = available[0];
    }
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.datacenterService.getSubnetMap({ parentCidr: this.parentCidr, prefixLength: this.prefixLength })
      .subscribe(({ body }) => {
        this.subnetMap = body;
        this.loading = false;
      });
  }

  getBlockColor(block: any): string {
    if (!block.allocated) {
      return 'var(--devui-base-bg, #f5f5f5)';
    }
    switch (block.allocationType) {
      case 'RESERVED': return '#fa9841';
      case 'VPC': return '#5e7ce0';
      case 'SUBNET': return '#3ac295';
      case 'VLAN': return '#7b69ee';
      default: return '#5e7ce0';
    }
  }

  getBlockBorder(block: any): string {
    return block.allocated ? '1px solid rgba(0,0,0,0.1)' : '1px solid var(--devui-dividing-line, #dfe1e6)';
  }

  onBlockClick(block: any) {
    const results = this.dialogService.open({
      id: 'subnet-block-detail',
      title: block.cidr + (block.allocated ? ' — ' + block.allocationName : ' — Available'),
      width: '900px',
      maxHeight: '500px',
      backdropCloseable: true,
      dialogtype: 'standard',
      content: SubnetBlockDetailComponent,
      buttons: [
        {
          cssClass: 'common',
          text: 'Close',
          handler: () => results.modalInstance.hide(),
        },
      ],
      data: { block },
    });
  }

}
