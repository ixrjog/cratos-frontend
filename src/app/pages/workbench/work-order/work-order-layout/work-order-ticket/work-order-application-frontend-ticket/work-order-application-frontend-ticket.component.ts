import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import {
  AssetPageQuery,
  EdsAssetVO,
  EdsInstanceVO,
  InstancePageQuery,
} from '../../../../../../@core/data/ext-datasource';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../@core/data/application';
import { ApplicationService } from '../../../../../../@core/services/application.service';
import { finalize } from 'rxjs';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordPageQuery,
  TrafficLayerRecordVO,
} from '../../../../../../@core/data/traffic-layer';
import { TrafficLayerService } from '../../../../../../@core/services/traffic-layer.service';

@Component({
  selector: 'app-work-order-application-frontend-ticket',
  templateUrl: './work-order-application-frontend-ticket.component.html',
  styleUrls: [ './work-order-application-frontend-ticket.component.less' ],
})
export class WorkOrderApplicationFrontendTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  gitLabInstance: EdsInstanceVO;
  gitLabProject: EdsAssetVO;
  applicationName: string;
  level: string = 'A1';
  mappingsPath: string = '/';
  copyFromApplication: ApplicationVO;
  tags: Map<string, string>;
  comment: string;
  applicationNameRegex = '[a-z][\\d0-9a-z-]{3,32}';
  loading: boolean = false;
  trafficLayerDomain: TrafficLayerDomainVO;
  TrafficLayerRecordList: TrafficLayerRecordVO[] = [];

  tabActiveId: string | number = 'A1';

  levelOptions = [
    { id: 'A1', title: 'A1' }, { id: 'A2', title: 'A2' }, { id: 'A3', title: 'A3' },
    { id: 'B1', title: 'B1' }, { id: 'B2', title: 'B2' }, { id: 'B3', title: 'B3' },
    { id: 'C1', title: 'C1' }, { id: 'C2', title: 'C2' }, { id: 'C3', title: 'C3' },
  ];

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsService: EdsService,
    private trafficLayerService: TrafficLayerService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
  }

  onSearchApplication = (term: string) => {
    const param: ApplicationPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.applicationService.queryApplicationPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((application, index) => ({ id: index, option: application })),
        ),
      );
  };

  onSearchGitLabInstance = (term: string) => {
    const param: InstancePageQuery = {
      edsType: 'GITLAB', length: 10, page: 1, queryName: term,
    };
    this.loading = true;
    return this.edsService.queryEdsInstancePage(param)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
        map(({ body }) =>
          body.data.map((permission, index) => ({ id: index, option: permission })),
        ),
      );
  };

  onSearchGitLabProject = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.gitLabInstance?.id,
      assetType: 'GITLAB_PROJECT',
      valid: true,
      length: 10,
      page: 1,
      queryName: term,
    };
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((permission, index) => ({ id: index, option: permission })),
        ),
      );
  };

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.tags = new Map<string, string>();
    this.tags.set('Level', this.level);
    console.log(Object.fromEntries(this.tags));
    this.workOrderTicketEntryService.addCreateFrontEndApplicationTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        applicationName: this.applicationName,
        domain: this.trafficLayerDomain.domain,
        mappingsPath: this.mappingsPath,
        copyFromApplication: this.copyFromApplication?.name,
        tags: Object.fromEntries(this.tags),
        comment: this.comment,
        repository: {
          instanceId: this.gitLabInstance.id,
          assetId: this.gitLabProject.id,
          sshUrl: this.gitLabProject.originalAsset['sshUrlToRepo'],
        },
      },
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  onRowRemove(rowItem: WorkOrderTicketEntryVO<any>) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketEntryService.deleteTicketEntryById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData();
        });
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onFetchData() {
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.data.hideDialog();
  }

  onLevelChange(tab) {
    this.level = tab;
  }

  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;

  onSearchTrafficLayerDomain = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.trafficLayerService.queryTrafficLayerDomainPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((group, index) => ({ id: index, option: group })),
        ),
      );
  };

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.onGetTrafficLayerRecord(domainVO.id);
  }

  onGetTrafficLayerRecord(domainId: number) {
    this.TrafficLayerRecordList = [];
    const param: TrafficLayerRecordPageQuery = {
      length: 10, page: 1, queryName: '', domainId: domainId, hasRouteTrafficTo: null,
    };
    this.trafficLayerService.queryTrafficLayerRecordPage(param)
      .subscribe(({ body }) => {
        this.TrafficLayerRecordList = body.data.sort((a, b) => b.env.seq - a.env.seq);
      });
  }

  gitLabProjectValueParser($event) {
    return $event['originalAsset']?.sshUrlToRepo;
  }

  onGetConvertUrl(recordName: string, mappingsPath: string) {
    const normalizedPath = '/' + mappingsPath.replace(/^\/+|\/+$/g, '') + '/';
    return `https://${recordName}${normalizedPath}`;
  }
}
