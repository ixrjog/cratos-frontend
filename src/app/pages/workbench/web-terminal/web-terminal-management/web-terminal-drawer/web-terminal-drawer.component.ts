import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EdsAssetVO } from '../../../../../@core/data/ext-datasource';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { onFetchData } from '../../../../../@shared/utils/data-table.utli';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { TagGroupService } from '../../../../../@core/services/tag-group.service';
import { GetGroupOptions, TagGroupAssetPageQuery } from '../../../../../@core/data/tag-group';
import { DataTableComponent } from 'ng-devui';
import { AddUserFavorite, FavoriteGroupVO, RemoveUserFavorite } from '../../../../../@core/data/user-favorite';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { UserFavoriteService } from '../../../../../@core/services/user-favorite.service';
import { ListValue } from '../../../../../@core/data/business-tag';

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

  isFavorite: boolean;
  favoriteGroupList: FavoriteGroupVO[] = [];
  isCollapsed = true;

  queryParam = {
    tagGroup: '',
    queryName: '',
  };

  table: Table<EdsAssetVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  // 添加表格高度控制属性
  public isCompactMode = false;

  // 跟踪已打开的终端
  private openedTerminals = new Set<string>();

  constructor(
    private userFavoriteService: UserFavoriteService,
    private tagGroupService: TagGroupService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private toastUtil: ToastUtil,
  ) {
    // 从静态变量获取数据
    this.data = WebTerminalDrawerComponent.drawerData;
  }

  ngOnInit(): void {
    // 设置搜索防抖
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.queryParam.queryName = searchValue;
      this.table.pager.pageIndex = 1;
    });

    this.onGetUserFavorite();
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

    this.cdr.detectChanges();
  }

  fetchData(): void {
    const param: TagGroupAssetPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };

    // 使用真实的API调用
    onFetchData(this.table, this.tagGroupService.queryMyGroupAssetPage(param));

    // 在数据加载完成后调整表格高度
    setTimeout(() => {
      this.adjustTableHeight();
    }, 500);
  }

  onSearchTagGroup = (term: string) => {
    const param: GetGroupOptions = {
      queryName: term,
    };
    return this.tagGroupService.getMyGroupOptions(param)
      .pipe(
        map(({ body }) =>
          body.options.map((option, index) => ({ id: index, label: option.value })),
        ),
      );
  };

  valueParser($event) {
    return $event['label'];
  }

  onTagGroupChange(option: any): void {
    this.queryParam.tagGroup = option;
    this.isFavorite = this.onIsFavorite()
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  onIsFavorite() : boolean {
    return this.favoriteGroupList.some(g => g.name === this.queryParam.tagGroup);
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
    // 标记该终端为已打开
    this.markTerminalAsOpened(asset);

    // 优先使用DrawerService传递的回调函数
    if (this.data && this.data.onAssetSelect) {
      this.data.onAssetSelect(asset);

      // 显示成功提示
      this.showSuccessMessage(asset.name);

      // 不自动关闭drawer，允许用户继续选择其他资产
      // if (this.data.close) {
      //   this.data.close();
      // }
    } else {
      // Fallback到Output事件（用于传统的父子组件通信）
      this.onAssetSelect.emit(asset);

      // 显示成功提示
      this.showSuccessMessage(asset.name);

      // 同样不自动关闭
      // this.onClose.emit();
    }
  }

  private showSuccessMessage(assetName: string): void {
    // Create a simple success message
    const message = `Terminal for "${assetName}" has been added successfully!`;

    // You can use toast or other notification methods
    // If you have toast service, you can use it like this:
    // this.toastService.success(message);
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
      // 标记该终端为已打开
      this.markTerminalAsOpened(asset);

      // 优先使用DrawerService传递的回调函数
      if (this.data && this.data.onAssetSelect) {
        this.data.onAssetSelect(asset);
      } else {
        // Fallback到Output事件
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

    // If you have toast service, you can use it like this:
    // this.toastService.success(`Successfully added ${count} terminals`);
  }

  onFavoriteClick() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.onAddGroupFavorite(this.queryParam.tagGroup);
    } else {
      this.onRemoveGroupFavorite(this.queryParam.tagGroup);
    }
  }

  onAddGroupFavorite(tagGroup: string) {
    const param: AddUserFavorite = {
      businessType: BusinessTypeEnum.TAG_GROUP,
      name: tagGroup,
    };
    this.userFavoriteService.addGroupFavorite(param)
      .subscribe(() => {
        this.onGetUserFavorite();
      });
  }

  onRemoveGroupFavorite(tagGroup: string) {
    const param: RemoveUserFavorite = {
      businessType: BusinessTypeEnum.TAG_GROUP,
      name: tagGroup,
    };
    this.userFavoriteService.removeGroupFavorite(param)
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        if (this.queryParam.tagGroup === tagGroup) {
          this.isFavorite = false;
        }
        this.onGetUserFavorite();
      });
  }

  onClick(group: FavoriteGroupVO) {
    this.isFavorite = true
    this.queryParam.tagGroup = group.name;
    this.fetchData();
    this.onAddGroupFavorite(group.name);
  }

  onGetUserFavorite() {
    this.userFavoriteService.getMyFavoriteGroup()
      .subscribe(({ body }) => {
        this.favoriteGroupList = body;
      });
  }

  /**
   * 标记终端为已打开状态
   * @param asset 资产对象
   */
  private markTerminalAsOpened(asset: EdsAssetVO): void {
    // 使用资产的唯一标识符（如ID或assetKey）作为键
    const terminalKey = String(asset.id || asset.assetKey || asset.name);
    this.openedTerminals.add(terminalKey);
  }

  /**
   * 检查终端是否已打开
   * @param asset 资产对象
   * @returns 是否已打开
   */
  public isTerminalOpened(asset: EdsAssetVO): boolean {
    const terminalKey = String(asset.id || asset.assetKey || asset.name);
    return this.openedTerminals.has(terminalKey);
  }

  /**
   * 清除已打开终端的标记（可选，用于重置状态）
   */
  public clearOpenedTerminals(): void {
    this.openedTerminals.clear();
  }

  protected readonly JSON = JSON;
}
