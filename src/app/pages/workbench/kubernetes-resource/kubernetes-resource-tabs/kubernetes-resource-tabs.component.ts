import { Component } from '@angular/core';
import { ApplicationPageQuery, ApplicationVO } from '../../../../@core/data/application';
import { KubernetesDetailsVO } from '../../../../@core/data/kubernetes';
import { ApplicationResourceService } from '../../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../../@core/services/application.service';
import { QueryApplicationResourceKubernetesDetails } from '../../../../@core/data/application-resource';
import { finalize } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kubernetes-resource-tabs',
  templateUrl: './kubernetes-resource-tabs.component.html',
  styleUrls: [ './kubernetes-resource-tabs.component.less' ],
})
export class KubernetesResourceTabsComponent {

  queryParam = {
    applicationName: '',
    namespace: '',
  };

  tabActiveId: string | number = 'workloads';
  application: ApplicationVO;
  nameSpaceLoading = false;
  nameSpaceDisabled = true;
  loading = false;
  kubernetesDetails: KubernetesDetailsVO = null;
  deploymentList = [];
  serviceList = [];
  resourceNamespaceOptions = [];
  show = false;

  constructor(
    private applicationResourceService: ApplicationResourceService,
    private applicationService: ApplicationService,
  ) {
  }

  fetchData() {
    if (this.queryParam.applicationName !== '' && this.queryParam.namespace !== '') {
      const param: QueryApplicationResourceKubernetesDetails = {
        ...this.queryParam,
      };
      this.show = false;
      this.kubernetesDetails = null;
      this.loading = true;
      this.applicationResourceService.queryApplicationResourceKubernetesDetails(param)
        .pipe(
          finalize(() => {
          this.loading = false;
          }),
        ).subscribe(
        ({ body }) => {
          this.kubernetesDetails = body.body;
          this.deploymentList = this.kubernetesDetails.workloads.deployments;
          this.serviceList = this.kubernetesDetails.network.services;
          this.show = true;
        },
      );
    }
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
    this.queryParam.applicationName = application?.name;
    this.queryParam.namespace = ''
    if (this.queryParam.applicationName) {
      this.getResourceNamespaceOptions();
    }
  }

  onResourceNamespaceChange(edsType: string) {
    this.fetchData();
  }

  getResourceNamespaceOptions() {
    // this.applicationService.getResourceNamespaceOptions()
    //   .subscribe(({ body }) => {
    //     this.resourceNamespaceOptions = body.options;
    //   });
    this.nameSpaceLoading = true;
    this.applicationService.getMyResourceNamespaceOptions({ applicationName: this.application.name })
      .pipe(
        finalize(() => {
          this.nameSpaceLoading = false;
        }),
      ).subscribe(
      ({ body }) => {
        this.resourceNamespaceOptions = body.options;
        this.nameSpaceDisabled = false;
      });
  };


  // ngOnInit() {
  //   this.getResourceNamespaceOptions();
  // }

}
