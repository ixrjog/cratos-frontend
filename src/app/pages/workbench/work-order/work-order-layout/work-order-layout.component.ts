import { Component, ViewChild } from '@angular/core';
import { WorkOrderVO } from '../../../../@core/data/work-order';
import { WorkOrderDataTableComponent } from './work-order-data-table/work-order-data-table.component';

@Component({
  selector: 'app-work-order-layout',
  templateUrl: './work-order-layout.component.html',
  styleUrls: [ './work-order-layout.component.less' ],
})
export class WorkOrderLayoutComponent {

  @ViewChild('workOrderDataTable') private workOrderDataTable: WorkOrderDataTableComponent;

  onNewData(workOrder: WorkOrderVO) {
    this.workOrderDataTable.onRowNew(workOrder)
  }

  onFetchData(workOrder: WorkOrderVO) {
    this.workOrderDataTable.fetchData(workOrder)
  }

}
