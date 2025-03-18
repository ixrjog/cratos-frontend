import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkOrderService } from '../../../../../@core/services/work-order.service';
import { WorkOrderVO } from '../../../../../@core/data/work-order';

@Component({
  selector: 'app-work-order-menu',
  templateUrl: './work-order-menu.component.html',
  styleUrls: [ './work-order-menu.component.less' ],
})
export class WorkOrderMenuComponent implements OnInit {

  @Output() onFetchData = new EventEmitter<WorkOrderVO>();
  @Output() onNewData = new EventEmitter<WorkOrderVO>();

  menu = [];

  constructor(private workOrderService: WorkOrderService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.workOrderService.getWorkOrderMenu()
      .subscribe(({ body }) => {
        body.groupList.forEach(group => {
          group['children'] = group.workOrderList;
          this.menu.push(group);
        });
      });
  }

  onRowNew(item: WorkOrderVO) {
    this.onNewData.emit(item);
  }

  onRowFilter(item: WorkOrderVO) {
    this.onFetchData.emit(item);
  }
}
