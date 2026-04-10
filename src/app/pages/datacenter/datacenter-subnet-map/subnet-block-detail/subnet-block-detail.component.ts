import { Component, Input, OnInit } from '@angular/core';
import { DatacenterService } from '../../../../@core/services/datacenter.service';

@Component({
  selector: 'app-subnet-block-detail',
  templateUrl: './subnet-block-detail.component.html',
})
export class SubnetBlockDetailComponent implements OnInit {

  @Input() data: any;
  block: any;
  allocations: any[] = [];
  loading = true;

  constructor(private datacenterService: DatacenterService) {
  }

  ngOnInit() {
    this.block = this.data['block'];
    this.datacenterService.queryAllocationsByCidr({ cidr: this.block.cidr })
      .subscribe(({ body }) => {
        this.allocations = body;
        this.loading = false;
      });
  }

}
