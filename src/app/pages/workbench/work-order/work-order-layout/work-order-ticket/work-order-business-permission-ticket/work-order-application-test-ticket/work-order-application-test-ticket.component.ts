import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBusinessPermissionTicketComponent } from '../work-order-business-permission-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { TEST } from '../../../../../../../@shared/constant/env-group.constant';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { UserBusinessPermission } from '../../../../../../../@core/data/user-permission';

@Component({
  selector: 'app-work-order-application-test-ticket',
  templateUrl: './work-order-application-test-ticket.component.html',
  styleUrls: ['./work-order-application-test-ticket.component.less']
})
export class WorkOrderApplicationTestTicketComponent implements OnInit {

  @ViewChild('workOrderBusinessPermissionTicket') private workOrderBusinessPermissionTicket: WorkOrderBusinessPermissionTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  businessType: string;
  envGroup: string = TEST;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(userBusinessPermission: UserBusinessPermission) {
    this.workOrderTicketEntryService.addApplicationTestPermissionTicketEntry({
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
