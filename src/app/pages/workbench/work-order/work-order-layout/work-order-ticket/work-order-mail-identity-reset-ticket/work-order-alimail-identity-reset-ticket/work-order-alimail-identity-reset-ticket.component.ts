import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { WorkOrderMailIdentityResetTicketComponent } from '../work-order-mail-identity-reset-ticket.component';
import { EdsMailAccountVO } from '../../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-work-order-alimail-identity-reset-ticket',
  templateUrl: './work-order-alimail-identity-reset-ticket.component.html',
  styleUrls: [ './work-order-alimail-identity-reset-ticket.component.less' ],
})
export class WorkOrderAlimailIdentityResetTicketComponent implements OnInit {

  @ViewChild('workOrderMailIdentityResetTicket') private workOrderMailIdentityResetTicket: WorkOrderMailIdentityResetTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(edsMailAccount: EdsMailAccountVO) {
    this.workOrderTicketEntryService.addResetAlimailUserTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: edsMailAccount,
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
    this.workOrderMailIdentityResetTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

}
