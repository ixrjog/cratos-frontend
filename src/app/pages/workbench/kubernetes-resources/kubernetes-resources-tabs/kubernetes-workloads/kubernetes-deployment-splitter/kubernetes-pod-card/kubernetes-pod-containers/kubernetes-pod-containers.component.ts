import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { KubernetesContainerVO, PodStatusVO } from '../../../../../../../../@core/data/kubernetes';
import { RELATIVE_TIME_LIMIT } from '../../../../../../../../@shared/utils/data.util';

@Component({
  selector: 'app-kubernetes-pod-containers',
  templateUrl: './kubernetes-pod-containers.component.html',
  styleUrls: [ './kubernetes-pod-containers.component.less' ],
})
export class KubernetesPodContainersComponent implements OnInit, OnChanges {

  @Input() containerStatuses: KubernetesContainerVO[];
  @Input() podStatus: PodStatusVO;
  @Input() containerName: string;

  container: KubernetesContainerVO;
  containerMap: Map<string, KubernetesContainerVO> = new Map<string, KubernetesContainerVO>();

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.containerMap = new Map();
    this.containerStatuses.map(containerStatus => {
        this.containerMap.set(containerStatus.name, containerStatus);
        if (containerStatus.main) {
          this.container = containerStatus;
        }
      },
    );
    this.container = this.containerMap.get(this.containerName);
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;

  ngOnChanges(changes: SimpleChanges): void {
    this.container = this.containerMap.get(this.containerName);
  }

}
