import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EdsAssetVO } from '../../../../../@core/data/ext-datasource';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { onFetchData } from '../../../../../@shared/utils/data-table.utli';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TagGroupService } from '../../../../../@core/services/tag-group.service';
import { GetGroupOptions, TagGroupAssetPageQuery } from '../../../../../@core/data/tag-group';
import { map } from 'rxjs/operators';
import { DataTableComponent } from 'ng-devui';

@Component({
  selector: 'app-web-terminal-drawer',
  templateUrl: './web-terminal-drawer.component.html',
  styleUrls: ['./web-terminal-drawer.component.less']
})
export class WebTerminalDrawerComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('datatable', { static: true }) datatable: DataTableComponent;

  // 静态变量用于接收数据
  static drawerData: any = {};

  // 保留Input和Output以防其他地方使用
  @Input() visible: boolean = false;
  @Output() onAssetSelect = new EventEmitter<EdsAssetVO>();
  @Output() onClose = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // 用于接收DrawerService传递的data
  public data: any = {};

  queryParam = {
    tagGroup: '',
    queryName: '',
  };

  table: Table<EdsAssetVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  // 添加表格高度控制属性
  public isCompactMode = false;

  constructor(
    private edsService: EdsService,
    private tagGroupService: TagGroupService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    // 从静态变量获取数据
    this.data = WebTerminalDrawerComponent.drawerData;
    console.log('Drawer constructor, received data:', this.data);
  }

  ngOnInit(): void {
    console.log('WebTerminalDrawerComponent ngOnInit, visible:', this.visible);

    // 设置搜索防抖
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.queryParam.queryName = searchValue;
      this.table.pager.pageIndex = 1;
    });
  }

  ngAfterViewInit(): void {
    // 初始化后检查表格高度
    setTimeout(() => {
      this.adjustTableHeight();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private adjustTableHeight(): void {
    const dataLength = this.table.data?.length || 0;
    const pageSize = this.table.pager.pageSize;
    
    // 如果数据量少于页面大小的一半，启用紧凑模式
    this.isCompactMode = dataLength > 0 && dataLength < Math.ceil(pageSize / 2);
    
    // 应用CSS类
    const container = this.elementRef.nativeElement.querySelector('.asset-search-container');
    if (container) {
      if (this.isCompactMode) {
        container.classList.add('compact-mode');
      } else {
        container.classList.remove('compact-mode');
      }
    }
    
    console.log(`Table height adjusted: dataLength=${dataLength}, pageSize=${pageSize}, compactMode=${this.isCompactMode}`);
    this.cdr.detectChanges();
  }

  fetchData(): void {
    const param: TagGroupAssetPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };

    // 使用真实的API调用
    onFetchData(this.table, this.tagGroupService.queryTagGroupAssetPage(param));
    
    // 在数据加载完成后调整表格高度
    setTimeout(() => {
      this.adjustTableHeight();
    }, 500);
  }

  onSearchTagGroup = (term: string) => {
    const param: GetGroupOptions = {
      queryName: term,
    };
    return this.tagGroupService.getGroupOptions(param)
      .pipe(
        map(({ body }) =>
          body.options.map((option, index) => ({ id: index, option: option })),
        ),
      );
  };

  onTagGroupChange(option: any): void {
    this.queryParam.tagGroup = option?.value || '';
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  onSearch(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  onPageIndexChange(pageIndex: number): void {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  onPageSizeChange(pageSize: number): void {
    this.table.pager.pageSize = pageSize;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  onAssetClick(asset: EdsAssetVO): void {
    console.log('onAssetClick called with asset:', asset);
    console.log('data object:', this.data);

    // 优先使用DrawerService传递的回调函数
    if (this.data && this.data.onAssetSelect) {
      console.log('Using DrawerService callback');
      this.data.onAssetSelect(asset);

      // 显示成功提示
      this.showSuccessMessage(asset.name);

      // 不自动关闭drawer，允许用户继续选择其他资产
      // if (this.data.close) {
      //   this.data.close();
      // }
    } else {
      // Fallback到Output事件（用于传统的父子组件通信）
      console.log('Using Output events');
      this.onAssetSelect.emit(asset);

      // 显示成功提示
      this.showSuccessMessage(asset.name);

      // 同样不自动关闭
      // this.onClose.emit();
    }
  }

  private showSuccessMessage(assetName: string): void {
    // 创建一个简单的成功提示
    const message = `Terminal for "${assetName}" has been added successfully!`;

    // 可以使用toast或者其他提示方式
    // 这里先用console.log，你可以根据项目的toast组件来替换
    console.log(message);

    // 如果有toast服务，可以这样使用：
    // this.toastService.success(message);
  }

  onDrawerClose(): void {
    if (this.data && this.data.close) {
      this.data.close();
    } else {
      this.onClose.emit();
    }
  }

  getCheckedRowsCount(): number {
    if (!this.datatable) {
      return 0;
    }
    const checkedRows = this.datatable.getCheckedRows();
    return checkedRows ? checkedRows.length : 0;
  }

  onBatchSelect(): void {
    if (!this.datatable) {
      console.warn('Datatable not available');
      return;
    }

    const checkedRows = this.datatable.getCheckedRows();
    if (!checkedRows || checkedRows.length === 0) {
      console.warn('No assets selected for batch operation');
      return;
    }

    console.log(`Batch selecting ${checkedRows.length} assets:`, checkedRows);

    // 批量添加选中的资产
    checkedRows.forEach((asset: EdsAssetVO) => {
      // 优先使用DrawerService传递的回调函数
      if (this.data && this.data.onAssetSelect) {
        console.log('Using DrawerService callback for asset:', asset.name);
        this.data.onAssetSelect(asset);
      } else {
        // Fallback到Output事件
        console.log('Using Output events for asset:', asset.name);
        this.onAssetSelect.emit(asset);
      }
    });

    // 显示批量成功提示
    this.showBatchSuccessMessage(checkedRows.length);

    // 清空选中列表
    this.datatable.setTableCheckStatus({ pageAllChecked: false });
  }

  private showBatchSuccessMessage(count: number): void {
    const message = `Successfully added ${count} terminals!`;
    console.log(message);

    // 如果有toast服务，可以这样使用：
    // this.toastService.success(`已成功添加 ${count} 个终端`);
  }
}
