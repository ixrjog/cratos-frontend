import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../../@core/data/application';
import { map } from 'rxjs/operators';
import { ApplicationService } from '../../../../../../../@core/services/application.service';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { ToastUtil } from '../../../../../../../@shared/utils/toast.util';
import { FormLayout } from 'ng-devui/form';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-application-elastic-scaling',
  templateUrl: './application-elastic-scaling.component.html',
  styleUrls: [ './application-elastic-scaling.component.less' ],
})
export class ApplicationElasticScalingComponent {

  @Output() onFetchData = new EventEmitter<null>();
  protected readonly FormLayout = FormLayout;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  application: ApplicationVO;
  namespace: string;
  resourceNamespaceOptions = [];
  expectedReplicas: number;
  nameSpaceLoading = false;

  constructor(
    private applicationService: ApplicationService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private toastUtil: ToastUtil) {
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

  onApplicationChange(application: ApplicationVO) {
    this.getResourceNamespaceOptions();
  }

  onResourceNamespaceChange(tab) {
    this.namespace = tab;
  }

  getResourceNamespaceOptions() {
    this.resourceNamespaceOptions = [];
    this.applicationService.getMyResourceNamespaceOptions({ applicationName: this.application.name })
      .pipe(
        finalize(() => {
          this.nameSpaceLoading = false;
        }),
      ).subscribe(
      ({ body }) => this.resourceNamespaceOptions = body.options);
  };

  onRowAdd() {
    if (this.application === undefined) {
      this.toastUtil.onErrorToast('application cannot be empty');
      return;
    }
    if (this.namespace === undefined) {
      this.toastUtil.onErrorToast('namespace cannot be empty');
      return;
    }
    if (this.expectedReplicas === undefined) {
      this.toastUtil.onErrorToast('expected replicas cannot be empty');
      return;
    }
    this.workOrderTicketEntryService.addElasticScalingOfApplicationReplicasTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        application: this.application,
        namespace: this.namespace,
        config: {
          expectedReplicas: this.expectedReplicas,
        },
      },
    }).subscribe(() => {
      this.onFetchData.emit();
    });
  }
}
