import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderCloudIdentityTicketComponent } from '../work-order-cloud-identity-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { CloudIdentityAccount } from '../../../../../../../@core/data/work-order-ticket-entry';

@Component({
  selector: 'app-work-order-gcp-iam-ticket',
  templateUrl: './work-order-gcp-iam-ticket.component.html',
  styleUrls: [ './work-order-gcp-iam-ticket.component.less' ],
})
export class WorkOrderGcpIamTicketComponent implements OnInit {

  @ViewChild('workOrderCloudIdentityTicket') private workOrderCloudIdentityTicket: WorkOrderCloudIdentityTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  member: string;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(cloudIdentityAccount: CloudIdentityAccount) {
    this.workOrderTicketEntryService.addGcpIamMemberTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        member: this.member,
        edsInstance: cloudIdentityAccount.edsInstance,
      },
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
