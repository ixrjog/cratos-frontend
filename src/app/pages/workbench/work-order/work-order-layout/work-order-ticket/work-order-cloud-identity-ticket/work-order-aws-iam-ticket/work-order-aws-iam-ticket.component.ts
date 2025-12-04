import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderCloudIdentityTicketComponent } from '../work-order-cloud-identity-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { CloudIdentityAccount } from '../../../../../../../@core/data/work-order-ticket-entry';

@Component({
  selector: 'app-work-order-aws-iam-ticket',
  templateUrl: './work-order-aws-iam-ticket.component.html',
  styleUrls: ['./work-order-aws-iam-ticket.component.less']
})
export class WorkOrderAwsIamTicketComponent implements OnInit {

  @ViewChild('workOrderCloudIdentityTicket') private workOrderCloudIdentityTicket: WorkOrderCloudIdentityTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(cloudIdentityAccount: CloudIdentityAccount) {
    this.workOrderTicketEntryService.addCreateAwsIamUserTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: cloudIdentityAccount,
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
    this.workOrderCloudIdentityTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

}
