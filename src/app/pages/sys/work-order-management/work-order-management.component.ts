import { Component, ViewChild } from '@angular/core';
import {
  WorkOrderGroupManagementDataTableComponent,
} from './work-order-group-management-data-table/work-order-group-management-data-table.component';
import {
  WorkOrderTicketManagementDataTableComponent,
} from './work-order-ticket-management-data-table/work-order-ticket-management-data-table.component';
import {
  WorkOrderManagementDataTableComponent
} from './work-order-management-data-table/work-order-management-data-table.component';

@Component({
  selector: 'app-work-order-management',
  templateUrl: './work-order-management.component.html',
  styleUrls: [ './work-order-management.component.less' ],
})
export class WorkOrderManagementComponent {

  @ViewChild('workOrderGroup') private workOrderGroup: WorkOrderGroupManagementDataTableComponent;
  @ViewChild('workOrder') private workOrder: WorkOrderManagementDataTableComponent;
  @ViewChild('workOrderTicket') private workOrderTicket: WorkOrderTicketManagementDataTableComponent;


  tabActiveId: string | number = 'work-order-group';

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'work-order-group':
        this.workOrderGroup.fetchData();
        break;
      case 'work-order':
        this.workOrder.fetchData();
        break;
      case 'work-order-ticket':
        this.workOrderTicket.fetchData();
        break;
      default:
        break;
    }
  }

}
