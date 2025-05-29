import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderCloudIdentityResetTicketComponent } from '../work-order-cloud-identity-reset-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { EdsCloudAccountVO } from '../../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-work-order-aws-iam-reset-ticket',
  templateUrl: './work-order-aws-iam-reset-ticket.component.html',
  styleUrls: [ './work-order-aws-iam-reset-ticket.component.less' ],
})
export class WorkOrderAwsIamResetTicketComponent implements OnInit {

  @ViewChild('workOrderCloudIdentityResetTicket') private workOrderCloudIdentityResetTicket: WorkOrderCloudIdentityResetTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(edsCloudAccount: EdsCloudAccountVO) {

    this.workOrderTicketEntryService.addResetAwsIamUserTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: edsCloudAccount,
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onFetchData() {
    this.workOrderCloudIdentityResetTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

}
