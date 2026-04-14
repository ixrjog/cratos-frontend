import { Component, OnInit } from '@angular/core';
import { DatacenterService } from '../../../@core/services/datacenter.service';
import { DialogService } from 'ng-devui';
import { SubnetBlockDetailComponent } from './subnet-block-detail/subnet-block-detail.component';
import { SubnetDrillComponent } from './subnet-drill/subnet-drill.component';

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
    '172.16.0.0/12': [16, 17, 18, 19, 20, 21, 22, 23, 24],
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

  private typeColorMap = {
    'RESERVED': '#fa9841',
    'VPC': '#5e7ce0',
    'SUBNET': '#3ac295',
    'VLAN': '#7b69ee',
  };

  getBlockColor(block: any): string {
    if (!block.allocated) {
      return 'var(--devui-base-bg, #f5f5f5)';
    }
    const types: string[] = block.allocationTypes || [block.allocationType];
    if (types.length <= 1) {
      return this.typeColorMap[types[0]] || '#5e7ce0';
    }
    const colors = types.map(t => this.typeColorMap[t] || '#5e7ce0');
    const step = 100 / colors.length;
    const stops = colors.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(', ');
    return `linear-gradient(135deg, ${stops})`;
  }

  getBlockBorder(block: any): string {
    return block.allocated ? '1px solid rgba(0,0,0,0.1)' : '1px solid var(--devui-dividing-line, #dfe1e6)';
  }

  onBlockClick(block: any) {
    if (block.allocated) {
      const results = this.dialogService.open({
        id: 'subnet-block-detail',
        title: block.cidr + ' — ' + block.allocationName,
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
    } else {
      this.openSubnetDrill(block.cidr);
    }
  }

  openSubnetDrill(cidr: string) {
    const currentPrefix = parseInt(cidr.split('/')[1], 10);
    const nextPrefix = currentPrefix + 1;
    if (nextPrefix > 28) {
      return;
    }
    const results = this.dialogService.open({
      id: 'subnet-drill-' + cidr,
      title: cidr + ' — Subnet Division',
      width: '900px',
      maxHeight: '600px',
      backdropCloseable: true,
      dialogtype: 'standard',
      content: SubnetDrillComponent,
      buttons: [
        {
          cssClass: 'common',
          text: 'Close',
          handler: () => results.modalInstance.hide(),
        },
      ],
      data: { parentCidr: cidr, prefixLength: nextPrefix },
    });
  }

}
