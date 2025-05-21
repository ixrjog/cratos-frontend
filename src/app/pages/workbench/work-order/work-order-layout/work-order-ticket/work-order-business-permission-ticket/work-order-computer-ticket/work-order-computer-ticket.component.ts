import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBusinessPermissionTicketComponent } from '../work-order-business-permission-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { UserBusinessPermission } from '../../../../../../../@core/data/user-permission';

@Component({
  selector: 'app-work-order-computer-ticket',
  templateUrl: './work-order-computer-ticket.component.html',
  styleUrls: [ './work-order-computer-ticket.component.less' ],
})
export class WorkOrderComputerTicketComponent implements OnInit {

  @ViewChild('workOrderBusinessPermissionTicket') private workOrderBusinessPermissionTicket: WorkOrderBusinessPermissionTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  businessType: string;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(userBusinessPermission: UserBusinessPermission) {
    this.workOrderTicketEntryService.addComputerPermissionTicketEntry({
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
