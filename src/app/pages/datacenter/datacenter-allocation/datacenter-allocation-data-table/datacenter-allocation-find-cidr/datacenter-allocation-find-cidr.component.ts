import { Component, Input, OnInit } from '@angular/core';
import { DatacenterService } from '../../../../../@core/services/datacenter.service';

@Component({
  selector: 'app-datacenter-allocation-find-cidr',
  templateUrl: './datacenter-allocation-find-cidr.component.html',
  styleUrls: ['./datacenter-allocation-find-cidr.component.less'],
})
export class DatacenterAllocationFindCidrComponent implements OnInit {

  @Input() data: any;

  parentCidrOptions = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];
  prefixLengthOptions = Array.from({ length: 13 }, (_, i) => i + 12); // 12-24

  selectedParentCidr: string = '10.0.0.0/8';
  selectedPrefixLength: number = 24;
  loading: boolean = false;
  result: any = null;

  constructor(private datacenterService: DatacenterService) {
  }

  ngOnInit(): void {
  }

  onFind() {
    this.loading = true;
    this.result = null;
    this.datacenterService.findAvailableCidrs({
      parentCidr: this.selectedParentCidr,
      prefixLength: this.selectedPrefixLength,
      limit: 20,
    }).subscribe({
      next: ({ body }) => {
        this.result = body;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

}
