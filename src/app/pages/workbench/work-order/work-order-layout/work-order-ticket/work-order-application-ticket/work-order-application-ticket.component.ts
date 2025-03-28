import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { UserBusinessPermission } from '../../../../../../@core/data/user-permission';
import { WorkOrderTicketDetailsVO } from '../../../../../../@core/data/work-order-ticket';
import {
  WorkOrderBusinessPermissionTicketComponent,
} from '../work-order-business-permission-ticket/work-order-business-permission-ticket.component';

@Component({
  selector: 'app-work-order-application-ticket',
  templateUrl: './work-order-application-ticket.component.html',
  styleUrls: [ './work-order-application-ticket.component.less' ],
})
export class WorkOrderApplicationTicketComponent implements OnInit {

  @ViewChild('workOrderBusinessPermissionTicket') private workOrderBusinessPermissionTicket: WorkOrderBusinessPermissionTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  businessType: string;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(userBusinessPermission: UserBusinessPermission) {
    this.workOrderTicketEntryService.addApplicationPermissionTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: userBusinessPermission,
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.businessType = this.data['businessType'];
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onFetchData() {
    this.workOrderBusinessPermissionTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

}
