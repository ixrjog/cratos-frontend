import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { APPROVAL_AGREE, APPROVAL_REJECT } from '../../../../../../../@shared/constant/approval.constant';
import { getPopoverStyle } from '../../../../../../../@shared/utils/theme.util';

@Component({
  selector: 'app-work-order-approval-process',
  templateUrl: './work-order-approval-process.component.html',
  styleUrls: [ './work-order-approval-process.component.less' ],
})
export class WorkOrderApprovalProcessComponent implements OnInit {

  @Input() ticketDetails: WorkOrderTicketDetailsVO;

  @ViewChild('startNode') startNode: TemplateRef<any>;
  @ViewChild('endNode') endNode: TemplateRef<any>;
  show = false;
  loadingDot = '<i class="fa-solid fa-spinner fa-spin-pulse" style="font-size:16px;color: #50d4ab"></i>';

  timeAxisTemplate = {
    direction: 'horizontal',
    model: 'template',
    horizontalAlign: 'left',
    list: [],
  };

  ngOnInit(): void {
    this.initApprovalProcess();
  }

  initApprovalProcess() {
    this.timeAxisTemplate.list.push({
      customDot: '<i class="fa-solid fa-play" style="font-size:16px"></i>',
      data: {
        nodeName: 'Start',
        username: this.ticketDetails?.ticket?.applicant?.username,
      },
    });
    this.ticketDetails.workflow.nodes.forEach(node => {
      let process = this.ticketDetails.nodes[node.name];
      let color = '';
      let customDot = ''
      if (process.approvalStatus === APPROVAL_AGREE) {
        color = 'var(--devui-success)';
      }
      if (process.approvalStatus === APPROVAL_REJECT) {
        color = 'var(--devui-danger)';
      }
      let timeAxis = {
        dotColor: color,
        data: {
          ...process,
          dotColor: color,
          color: color,
        },
      };
      if (node.name === this.ticketDetails.currentNode && process.approvalCompleted === null) {
        timeAxis['customDot'] = this.loadingDot;
      }
      this.timeAxisTemplate.list.push(timeAxis);
    });
    this.timeAxisTemplate.list.push({
      customDot: '<i class="fa-solid fa-circle-stop" style="font-size:16px"></i>',
      data: {
        nodeName: 'End',
      },
    });
    this.show = true;
  }

  protected readonly APPROVAL_AGREE = APPROVAL_AGREE;
  protected readonly getPopoverStyle = getPopoverStyle;
}
