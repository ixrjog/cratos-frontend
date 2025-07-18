import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { WorkOrderMonthReportComponent } from './work-order-month-report/work-order-month-report.component';
import { WorkOrderNameReportComponent } from './work-order-name-report/work-order-name-report.component';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isDark } from '../../../../@shared/utils/theme.util';

@Component({
  selector: 'app-work-order-report-management',
  templateUrl: './work-order-report-management.component.html',
  styleUrls: ['./work-order-report-management.component.less']
})
export class WorkOrderReportManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nameReport') nameReportComponent: WorkOrderNameReportComponent;
  @ViewChild('monthReport') monthReportComponent: WorkOrderMonthReportComponent;

  isRefreshing = false;
  lastRefreshTime = '';
  i18n: any = {};
  isDarkMode = false;
  private destroy$ = new Subject<void>();

  constructor(private translate: TranslateService) {
    this.initI18n();
  }

  // 暴露给模板使用的方法
  public get isDarkTheme(): boolean {
    return this.isDarkMode;
  }

  ngOnInit(): void {
    // 组件初始化时的逻辑
    this.updateLastRefreshTime();
    
    // 检查初始暗色模式
    this.isDarkMode = isDark();
  }

  ngAfterViewInit(): void {
    // 视图初始化后，确保子组件已经加载
    // Give Angular time to complete change detection
    setTimeout(() => {
      this.ensureChartsInitialized();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 初始化国际化
  private initI18n(): void {
    this.translate
      .get('workOrderTicket.report')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18n = res;
      });
      
    // 监听语言变化
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translate
          .get('workOrderTicket.report')
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.i18n = res;
          });
      });
  }

  // Ensure all charts are properly initialized
  private ensureChartsInitialized(): void {
    if (this.nameReportComponent && !this.nameReportComponent.isChartReady()) {
      this.nameReportComponent.forceInitChart();
    }

    if (this.monthReportComponent && !this.monthReportComponent.isChartReady()) {
      this.monthReportComponent.forceInitChart();
    }
  }

  refreshData(): void {
    this.isRefreshing = true;

    // 刷新名称报表
    const nameReportPromise = new Promise<void>((resolve) => {
      if (this.nameReportComponent) {
        // Use the refresh method instead of loadData directly
        this.nameReportComponent.refresh();
        // 由于loadData是异步的，我们需要监听loading状态变化
        const checkLoading = setInterval(() => {
          if (!this.nameReportComponent.loading) {
            clearInterval(checkLoading);
            resolve();
          }
        }, 100);
      } else {
        resolve();
      }
    });

    // 刷新月度报表
    const monthReportPromise = new Promise<void>((resolve) => {
      if (this.monthReportComponent) {
        // Use the refresh method instead of loadData directly
        this.monthReportComponent.refresh();
        // 由于loadData是异步的，我们需要监听loading状态变化
        const checkLoading = setInterval(() => {
          if (!this.monthReportComponent.loading) {
            clearInterval(checkLoading);
            resolve();
          }
        }, 100);
      } else {
        resolve();
      }
    });

    // 当两个报表都刷新完成后，更新状态
    Promise.all([nameReportPromise, monthReportPromise]).then(() => {
      this.isRefreshing = false;
      this.updateLastRefreshTime();
    });
  }

  exportData(): void {
    try {
      const dataTypeLabel = this.i18n.dataType || '数据类型';
      const nameLabel = this.i18n.name || '名称';
      const countLabel = this.i18n.workOrderCount || '数量';
      const nameReportLabel = this.i18n.nameReport || '工单名称';
      const monthReportLabel = this.i18n.monthlyReport || '月度统计';
      
      let csvContent = `${dataTypeLabel},${nameLabel},${countLabel}\n`;

      // 添加名称报表数据
      if (this.nameReportComponent && this.nameReportComponent.reportData) {
        this.nameReportComponent.reportData.forEach(item => {
          // 处理字段名称不一致的问题
          const name = item.cName || item.cname || (this.i18n.unknown || '未知');
          csvContent += `${nameReportLabel},${name},${item.value}\n`;
        });
      }

      // 添加月度报表数据
      if (this.monthReportComponent && this.monthReportComponent.reportData) {
        const { dates, nameCat } = this.monthReportComponent.reportData;

        if (dates && nameCat) {
          Object.entries(nameCat).forEach(([name, stats]) => {
            if (stats && stats.values) {
              stats.values.forEach((value, index) => {
                if (index < dates.length) {
                  csvContent += `${monthReportLabel},${name} (${dates[index]}),${value}\n`;
                }
              });
            }
          });
        }
      }

      // 创建并下载CSV文件
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      const fileName = `${this.i18n.title || '工单统计报表'}_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export report data:', error);
      alert(this.i18n.exportFailed || '导出数据失败，请查看控制台了解详情');
    }
  }

  private updateLastRefreshTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.lastRefreshTime = `${hours}:${minutes}:${seconds}`;
  }
}
