import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { CloudIdentityReset } from '../../../../../../../@core/data/work-order-ticket-entry';
import { WorkOrderCloudIdentityResetTicketComponent } from '../work-order-cloud-identity-reset-ticket.component';

@Component({
  selector: 'app-work-order-aliyun-ram-reset-ticket',
  templateUrl: './work-order-aliyun-ram-reset-ticket.component.html',
  styleUrls: [ './work-order-aliyun-ram-reset-ticket.component.less' ],
})
export class WorkOrderAliyunRamResetTicketComponent implements OnInit {

  @ViewChild('workOrderCloudIdentityResetTicket') private workOrderCloudIdentityResetTicket: WorkOrderCloudIdentityResetTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(cloudIdentityReset: CloudIdentityReset) {
    this.workOrderTicketEntryService.addResetAliyunRamUserTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: cloudIdentityReset,
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
