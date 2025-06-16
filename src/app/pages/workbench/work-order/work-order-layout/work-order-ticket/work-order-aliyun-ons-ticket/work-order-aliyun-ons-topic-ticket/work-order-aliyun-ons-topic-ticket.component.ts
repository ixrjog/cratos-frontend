import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { ToastUtil } from '../../../../../../../@shared/utils/toast.util';
import { WorkOrderAliyunOnsTicketComponent } from '../work-order-aliyun-ons-ticket.component';
import { CreateAliyunOnsResource } from '../../../../../../../@core/data/work-order-ticket-entry';
import { TranslateService } from '@ngx-translate/core';
import { WorkOrderStatus } from '../../../../../../../@core/data/work-order';

@Component({
  selector: 'app-work-order-aliyun-ons-topic-ticket',
  templateUrl: './work-order-aliyun-ons-topic-ticket.component.html',
  styleUrls: [ './work-order-aliyun-ons-topic-ticket.component.less' ],
})
export class WorkOrderAliyunOnsTopicTicketComponent implements OnInit {

  @ViewChild('workOrderAliyunOnsTicket') private workOrderAliyunOnsTicket: WorkOrderAliyunOnsTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  topicName: string = 'TOPIC_';
  messageType: string = 'NORMAL';
  tabActiveId: string | number = 'NORMAL';
  messageTypeOptions = [];

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService,
              private toastUtil: ToastUtil,
              private translate: TranslateService) {
  }

  onAddTicketEntry(createAliyunOnsResource: CreateAliyunOnsResource) {
    if (this.topicName === '') {
      this.toastUtil.onErrorToast('topic name can not be empty');
      return;
    }
    this.workOrderTicketEntryService.addCreateAliyunOnsTopicTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        ...createAliyunOnsResource,
        topicName: this.topicName,
        messageType: this.messageType,
      },
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.translate.get('workOrderTicket').subscribe((res) => {
      this.onGetMessageTypeOptions(res);
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onGetMessageTypeOptions(values: any) {
    this.messageTypeOptions = [
      {
        id: 'NORMAL',
        title: values['aliyunOns']['topic']['messageTypes']['title']['normal'],
        desc: values['aliyunOns']['topic']['messageTypes']['desc']['normal'],
      },
      {
        id: 'FIFO',
        title: values['aliyunOns']['topic']['messageTypes']['title']['fifo'],
        desc: values['aliyunOns']['topic']['messageTypes']['desc']['fifo'],
      },
      {
        id: 'DELAY',
        title: values['aliyunOns']['topic']['messageTypes']['title']['delay'],
        desc: values['aliyunOns']['topic']['messageTypes']['desc']['delay'],
      },
      {
        id: 'TRANSACTION',
        title: values['aliyunOns']['topic']['messageTypes']['title']['transaction'],
        desc: values['aliyunOns']['topic']['messageTypes']['desc']['transaction'],
      },
    ];
  }

  onFetchData() {
    this.workOrderAliyunOnsTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

  onActiveTabChange(tab) {
    this.messageType = tab;
  }

  onRowRemove(entry: WorkOrderTicketEntryVO<CreateAliyunOnsResource>) {
    this.workOrderAliyunOnsTicket.onRowRemove(entry);
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly JSON = JSON;
}
