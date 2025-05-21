import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderGitlabTicketComponent } from '../work-order-gitlab-ticket.component';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { GitLabPermission } from '../../../../../../../@core/data/work-order-ticket-entry';

@Component({
  selector: 'app-work-order-gitlab-project-ticket',
  templateUrl: './work-order-gitlab-project-ticket.component.html',
  styleUrls: ['./work-order-gitlab-project-ticket.component.less']
})
export class WorkOrderGitlabProjectTicketComponent implements OnInit {

  @ViewChild('workOrderGitlabPermissionTicket') private workOrderGitlabPermissionTicket: WorkOrderGitlabTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService) {
  }

  onAddTicketEntry(gitLabPermission: GitLabPermission) {
    this.workOrderTicketEntryService.addGitLabProjectPermissionTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: gitLabPermission,
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
    this.workOrderGitlabPermissionTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

}
