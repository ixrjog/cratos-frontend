import { Component, Input, OnInit } from '@angular/core';
import { KubernetesContainerVO, PodStatusVO } from '../../../../../../../@core/data/kubernetes';
import { RELATIVE_TIME_LIMIT } from '../../../../../../../@shared/utils/data.util';

@Component({
  selector: 'app-kubernetes-pod-containers',
  templateUrl: './kubernetes-pod-containers.component.html',
  styleUrls: [ './kubernetes-pod-containers.component.less' ],
})
export class KubernetesPodContainersComponent implements OnInit {

  @Input() containerStatuses: KubernetesContainerVO[];
  @Input() podStatus: PodStatusVO;

  container: KubernetesContainerVO;
  rotateDegrees = 0;
  containerMap: Map<string, KubernetesContainerVO> = new Map<string, KubernetesContainerVO>();
  show: boolean = false;
  menuitem = [];


  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.containerMap = new Map();
    this.containerStatuses.map(containerStatus => {
        this.menuitem.push(containerStatus.name);
        this.containerMap.set(containerStatus.name, containerStatus);
        if (containerStatus.main) {
          this.container = containerStatus;
        }
      },
    );
    this.show = true;
  }

  onToggle(event) {
    this.rotateDegrees = event ? 180 : 0;
  }

  onRowSelect(item) {
    this.container = this.containerMap.get(item);
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}
