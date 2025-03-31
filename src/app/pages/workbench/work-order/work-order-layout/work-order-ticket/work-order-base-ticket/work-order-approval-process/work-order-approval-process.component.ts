import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';

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
      },
    });
    this.ticketDetails.workflow.nodes.forEach(node => {
      let process = this.ticketDetails.nodes[node.name];
      process['isCurrent'] = node.name === this.ticketDetails.currentNode;
      this.timeAxisTemplate.list.push({
        customDot: node.name === this.ticketDetails.currentNode ? this.loadingDot : null,
        data: process,
      });
    });
    this.timeAxisTemplate.list.push({
      customDot: '<i class="fa-solid fa-circle-stop" style="font-size:16px"></i>',
      data: {
        nodeName: 'End',
      },
    });
    this.show = true;
  }


}
