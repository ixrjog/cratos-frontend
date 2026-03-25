import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderCloudPolicyTicketComponent } from '../work-order-cloud-policy-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { CloudPolicy } from '../../../../../../../@core/data/work-order-ticket-entry';

@Component({
  selector: 'app-work-order-gcp-iam-role-ticket',
  templateUrl: './work-order-gcp-iam-role-ticket.component.html',
  styleUrls: ['./work-order-gcp-iam-role-ticket.component.less']
})
export class WorkOrderGcpIamRoleTicketComponent implements OnInit {

  @ViewChild('workOrderCloudPolicyTicket') private workOrderCloudPolicyTicket: WorkOrderCloudPolicyTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(cloudPolicy: CloudPolicy) {
    this.workOrderTicketEntryService.addGcpIamRoleTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: cloudPolicy,
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
    this.workOrderCloudPolicyTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

}
