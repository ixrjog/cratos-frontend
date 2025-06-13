import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBusinessPermissionTicketComponent } from '../work-order-business-permission-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { UserBusinessPermission } from '../../../../../../../@core/data/user-permission';
import { PROD } from '../../../../../../../@shared/constant/env-group.constant';

@Component({
  selector: 'app-work-order-application-prod-ticket',
  templateUrl: './work-order-application-prod-ticket.component.html',
  styleUrls: ['./work-order-application-prod-ticket.component.less']
})
export class WorkOrderApplicationProdTicketComponent implements OnInit {

  @ViewChild('workOrderBusinessPermissionTicket') private workOrderBusinessPermissionTicket: WorkOrderBusinessPermissionTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  businessType: string;
  envGroup: string = PROD;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(userBusinessPermission: UserBusinessPermission) {
    this.workOrderTicketEntryService.addApplicationProdPermissionTicketEntry({
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
