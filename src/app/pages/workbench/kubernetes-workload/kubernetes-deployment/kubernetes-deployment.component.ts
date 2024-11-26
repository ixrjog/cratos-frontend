import { Component, OnInit } from '@angular/core';
import { ApplicationPageQuery, ApplicationVO } from '../../../../@core/data/application';
import { ApplicationResourceService } from '../../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../../@core/services/application.service';
import { map } from 'rxjs/operators';
import { QueryApplicationResourceKubernetesDetails } from '../../../../@core/data/application-resource';
import { finalize } from 'rxjs';
import { KubernetesDetailsVO } from '../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-deployment',
  templateUrl: './kubernetes-deployment.component.html',
  styleUrls: [ './kubernetes-deployment.component.less' ],
})
export class KubernetesDeploymentComponent implements OnInit {

  queryParam = {
    applicationName: '',
    namespace: '',
  };

  application: ApplicationVO;
  loading = false;
  cardDate: KubernetesDetailsVO = null;
  deploymentList = [];
  resourceNamespaceOptions = [];

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
      this.cardDate = null;
      this.loading = true;
      this.applicationResourceService.queryApplicationResourceKubernetesDetails(param).pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(
        ({ body }) => {
          this.cardDate = body.body;
          this.deploymentList = this.cardDate.deployments;
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
  }

  onResourceNamespaceChange(edsType: string) {
    this.fetchData();
  }

  getResourceNamespaceOptions() {
    this.applicationService.getResourceNamespaceOptions()
      .subscribe(({ body }) => {
        this.resourceNamespaceOptions = body.options;
      });
  };

  ngOnInit() {
    this.getResourceNamespaceOptions();
  }

}
