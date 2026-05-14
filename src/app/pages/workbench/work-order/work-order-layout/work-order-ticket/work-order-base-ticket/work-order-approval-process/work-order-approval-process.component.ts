import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO, WorkOrderTicketVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderStatus } from '../../../../../../../@core/data/work-order';
import { APPROVAL_AGREE, APPROVAL_REJECT } from '../../../../../../../@shared/constant/approval.constant';
import { getPopoverStyle } from '../../../../../../../@shared/utils/theme.util';
import { RELATIVE_TIME_LIMIT } from '../../../../../../../@shared/constant/date.constant';

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
        time: this.ticketDetails?.ticket?.submittedAt,
      },
    });
    this.ticketDetails.workflow.nodes.forEach(node => {
      let process = this.ticketDetails.nodes[node.name];
      let color = '';
      if (process.approvalStatus === APPROVAL_AGREE) {
        color = 'var(--devui-success)';
      }
      if (process.approvalStatus === APPROVAL_REJECT) {
        color = 'var(--devui-danger)';
      }
      const displayName = this.getNodeDisplayName(node);
      let timeAxis = {
        dotColor: color,
        data: {
          ...process,
          nodeName: displayName,
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
      customDot: '<i class="fa-solid fa-stop" style="font-size:16px"></i>',
      data: {
        nodeName: 'End',
        ticketState: this.ticketDetails?.ticket?.ticketState,
        ticketResult: this.ticketDetails?.ticket?.ticketResult,
        time: this.ticketDetails?.ticket?.completedAt,
      },
    });
    this.show = true;
  }


  onGetTicketStateColor() {
    const ticket: WorkOrderTicketVO = this.ticketDetails.ticket;
    if (ticket.ticketState === WorkOrderStatus.COMPLETED) {
      if (ticket.success) {
        return 'green-w98';
      }
      return 'red-w98';
    }
    return 'blue-w98';
  }

  protected readonly APPROVAL_AGREE = APPROVAL_AGREE;
  protected readonly getPopoverStyle = getPopoverStyle;
  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly WorkOrderStatus = WorkOrderStatus;

  private getNodeDisplayName(node: any): string {
    const lang = localStorage.getItem('lang') || 'en-us';
    if (node.langMap && node.langMap[lang] && node.langMap[lang].displayName) {
      return node.langMap[lang].displayName;
    }
    return node.name;
  }
}
