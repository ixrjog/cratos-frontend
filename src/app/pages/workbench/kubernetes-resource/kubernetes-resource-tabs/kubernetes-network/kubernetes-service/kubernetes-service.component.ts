import { Component, Input, OnInit } from '@angular/core';
import { getRowColor } from 'src/app/@shared/utils/data-table.utli';
import { KubernetesServiceVO } from '../../../../../../@core/data/kubernetes';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/utils/data.util';

@Component({
  selector: 'app-kubernetes-service',
  templateUrl: './kubernetes-service.component.html',
  styleUrls: ['./kubernetes-service.component.less']
})
export class KubernetesServiceComponent implements OnInit {

  @Input() serviceList: KubernetesServiceVO[];
  tableData = [];

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  ngOnInit(): void {
    this.tableData = [];
    this.serviceList.map(service => {
      const item = {
        name: service.metadata.name,
        ...service.spec
      }
      this.tableData.push(item);
    });
  }

}
