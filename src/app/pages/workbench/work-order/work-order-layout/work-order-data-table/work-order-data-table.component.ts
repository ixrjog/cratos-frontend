import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../../../../../@core/services/work-order.service';
import { WorkOrderVO } from '../../../../../@core/data/work-order';

@Component({
  selector: 'app-work-order-data-table',
  templateUrl: './work-order-data-table.component.html',
  styleUrls: [ './work-order-data-table.component.less' ],
})
export class WorkOrderDataTableComponent implements OnInit {


  constructor(private workOrderService: WorkOrderService) {
  }

  ngOnInit(): void {
  }


  fetchData(workOrder: WorkOrderVO) {
    console.log(workOrder);
  }

  onRowNew(workOrder: WorkOrderVO) {
    console.log(workOrder);

  }

}
