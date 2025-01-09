import { Component, Input, OnInit } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../@core/data/application';


@Component({
  selector: 'app-kubernetes-pod-batch-logs',
  templateUrl: './kubernetes-pod-batch-logs.component.html',
  styleUrls: [ './kubernetes-pod-batch-logs.component.less' ],
})
export class KubernetesPodBatchLogsComponent implements OnInit {

  @Input() fullScreen: any;
  @Input() close: any;
  @Input() formData: any;
  deploymentList: KubernetesDeploymentVO[];
  application: ApplicationVO;

  isFullScreen = false;

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.fullScreen();
  }

  ngOnInit(): void {
    this.deploymentList = this.formData['deploymentList'];
    this.application = this.formData['application'];
  }

}
