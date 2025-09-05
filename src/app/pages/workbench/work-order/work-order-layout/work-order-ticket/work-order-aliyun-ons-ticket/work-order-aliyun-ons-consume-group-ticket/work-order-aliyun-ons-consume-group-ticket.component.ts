import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderAliyunOnsTicketComponent } from '../work-order-aliyun-ons-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../../@core/data/work-order-ticket';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { ToastUtil } from '../../../../../../../@shared/utils/toast.util';
import { TranslateService } from '@ngx-translate/core';
import { CreateAliyunOnsResource } from '../../../../../../../@core/data/work-order-ticket-entry';
import { WorkOrderStatus } from '../../../../../../../@core/data/work-order';
import { getResourceCountColor, parseResourceCount } from '../../../../../../../@shared/utils/resource-count.util';
import { getPopoverStyle } from '../../../../../../../@shared/utils/theme.util';
import { EdsAssetIndexVO, EdsAssetVO } from '../../../../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../../../../@core/services/ext-datasource.service.s';


@Component({
  selector: 'app-work-order-aliyun-ons-consume-group-ticket',
  templateUrl: './work-order-aliyun-ons-consume-group-ticket.component.html',
  styleUrls: [ './work-order-aliyun-ons-consume-group-ticket.component.less' ],
})
export class WorkOrderAliyunOnsConsumeGroupTicketComponent implements OnInit {

  @ViewChild('workOrderAliyunOnsTicket') private workOrderAliyunOnsTicket: WorkOrderAliyunOnsTicketComponent;
  @Input() data: any;
  i18nValues: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  consumerGroupId: string = 'GID_';
  deliveryOrderType: string = 'Concurrently';
  deliveryOrderTypeActiveId: string | number = 'Concurrently';
  deliveryOrderTypeOptions = [];

  retryPolicy: string = 'DefaultRetryPolicy';
  retryPolicyActiveId: string | number = 'DefaultRetryPolicy';
  retryPolicyOptions = [];

  maxRetryTimes: number = 16;
  assetIndexTable: EdsAssetIndexVO[] = [];

  constructor(private workOrderTicketEntryService: WorkOrderTicketEntryService,
              private edsService:EdsService,
              private toastUtil: ToastUtil,
              private translate: TranslateService) {
  }

  onAddTicketEntry(createAliyunOnsResource: CreateAliyunOnsResource) {
    if (this.consumerGroupId === '') {
      this.toastUtil.onErrorToast('consumer group can not be empty');
      return;
    }
    this.workOrderTicketEntryService.addCreateAliyunOnsConsumerGroupTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        ...createAliyunOnsResource,
        consumerGroupId: this.consumerGroupId,
        deliveryOrderType: this.deliveryOrderType,
        consumeRetryPolicy: {
          retryPolicy: this.retryPolicy,
          maxRetryTimes: this.maxRetryTimes,
        },
      },
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.translate.get('workOrderTicket').subscribe((res) => {
      this.i18nValues = res;
      this.onGetDeliveryOrderTypes(this.i18nValues);
      this.onGetRetryPolicies(this.i18nValues);
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onGetDeliveryOrderTypes(values: any) {
    this.deliveryOrderTypeOptions = [
      {
        id: 'Concurrently',
        title: values['aliyunOns']['consumerGroup']['deliveryOrderType']['title']['concurrently'],
        desc: values['aliyunOns']['consumerGroup']['deliveryOrderType']['desc']['concurrently'],
      },
      {
        id: 'Orderly',
        title: values['aliyunOns']['consumerGroup']['deliveryOrderType']['title']['orderly'],
        desc: values['aliyunOns']['consumerGroup']['deliveryOrderType']['desc']['orderly'],
      },
    ];
  }

  onGetRetryPolicies(values: any) {
    if (this.deliveryOrderType === 'Concurrently') {
      this.retryPolicyOptions = [
        {
          id: 'DefaultRetryPolicy',
          title: values['aliyunOns']['consumerGroup']['retryPolicy']['title']['defaultRetryPolicy'],
          desc: values['aliyunOns']['consumerGroup']['retryPolicy']['desc']['defaultRetryPolicy'],
        },
      ];
    }

    if (this.deliveryOrderType === 'Orderly') {
      this.retryPolicyOptions = [
        {
          id: 'FixedRetryPolicy',
          title: values['aliyunOns']['consumerGroup']['retryPolicy']['title']['fixedRetryPolicy'],
          desc: values['aliyunOns']['consumerGroup']['retryPolicy']['desc']['fixedRetryPolicy'],
        },
      ];
    }
  }

  onFetchData() {
    this.workOrderAliyunOnsTicket.onFetchData();
  }

  onCancel() {
    this.data.hideDialog();
  }

  onActiveDeliveryOrderTypeChange(tab) {
    this.deliveryOrderType = tab;
    if (this.deliveryOrderType === 'Concurrently') {
      this.retryPolicyActiveId = 'DefaultRetryPolicy';
      this.retryPolicy = 'DefaultRetryPolicy';
    }
    if (this.deliveryOrderType === 'Orderly') {
      this.retryPolicyActiveId = 'FixedRetryPolicy';
      this.retryPolicy = 'FixedRetryPolicy';
    }
    this.onGetRetryPolicies(this.i18nValues);
  }

  onRowRemove(entry: WorkOrderTicketEntryVO<CreateAliyunOnsResource>) {
    this.workOrderAliyunOnsTicket.onRowRemove(entry);
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly JSON = JSON;
  protected readonly getResourceCountColor = getResourceCountColor;
  protected readonly parseResourceCount = parseResourceCount;
  protected readonly getPopoverStyle = getPopoverStyle;


  onQueryAssetIndex(rowItem: EdsAssetVO) {
    this.assetIndexTable = [];
    if (!parseResourceCount(rowItem)) {
      return;
    }
    this.edsService.queryAssetIndexByAssetId({ assetId: rowItem.id })
      .subscribe(({ body }) => this.assetIndexTable = body);
  }
}
