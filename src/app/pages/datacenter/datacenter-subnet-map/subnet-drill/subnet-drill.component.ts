import { Component, Input, OnInit } from '@angular/core';
import { DatacenterService } from '../../../../@core/services/datacenter.service';
import { DialogService } from 'ng-devui';
import { SubnetBlockDetailComponent } from '../subnet-block-detail/subnet-block-detail.component';

@Component({
  selector: 'app-subnet-drill',
  templateUrl: './subnet-drill.component.html',
  styleUrls: ['./subnet-drill.component.less'],
})
export class SubnetDrillComponent implements OnInit {

  @Input() data: any;
  parentCidr = '';
  prefixLength = 0;
  availablePrefixLengths: number[] = [];
  subnetMap: any = null;
  loading = true;

  private typeColorMap = {
    'RESERVED': '#fa9841',
    'VPC': '#5e7ce0',
    'SUBNET': '#3ac295',
    'VLAN': '#7b69ee',
  };

  constructor(private datacenterService: DatacenterService, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.parentCidr = this.data['parentCidr'];
    this.prefixLength = this.data['prefixLength'];
    const basePrefix = parseInt(this.parentCidr.split('/')[1], 10);
    this.availablePrefixLengths = [];
    for (let p = basePrefix + 1; p <= Math.min(basePrefix + 8, 28); p++) {
      this.availablePrefixLengths.push(p);
    }
    if (!this.availablePrefixLengths.includes(this.prefixLength)) {
      this.prefixLength = this.availablePrefixLengths[0];
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
    const types: string[] = block.allocationTypes || [block.allocationType];
    if (types.length <= 1) {
      return this.typeColorMap[types[0]] || '#5e7ce0';
    }
    const colors = types.map(t => this.typeColorMap[t] || '#5e7ce0');
    const step = 100 / colors.length;
    const stops = colors.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(', ');
    return `linear-gradient(135deg, ${stops})`;
  }

  getIpCount(cidr: string): number {
    const prefix = parseInt(cidr.split('/')[1], 10);
    return Math.pow(2, 32 - prefix);
  }

  onBlockClick(block: any) {
    if (block.allocated) {
      const results = this.dialogService.open({
        id: 'subnet-block-detail-drill',
        title: block.cidr + ' — ' + block.allocationName,
        width: '900px',
        maxHeight: '500px',
        backdropCloseable: true,
        dialogtype: 'standard',
        content: SubnetBlockDetailComponent,
        buttons: [{ cssClass: 'common', text: 'Close', handler: () => results.modalInstance.hide() }],
        data: { block },
      });
    } else {
      const currentPrefix = parseInt(block.cidr.split('/')[1], 10);
      if (currentPrefix >= 28) {
        return;
      }
      this.parentCidr = block.cidr;
      const basePrefix = currentPrefix;
      this.availablePrefixLengths = [];
      for (let p = basePrefix + 1; p <= Math.min(basePrefix + 8, 28); p++) {
        this.availablePrefixLengths.push(p);
      }
      this.prefixLength = this.availablePrefixLengths[0];
      this.fetchData();
    }
  }
}
