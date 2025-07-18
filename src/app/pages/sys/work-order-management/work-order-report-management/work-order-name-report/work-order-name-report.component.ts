// 添加ResizeObserver类型声明
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkOrderService } from '../../../../../@core/services/work-order.service';
import * as echarts from 'echarts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-work-order-name-report',
  templateUrl: './work-order-name-report.component.html',
  styleUrls: [ './work-order-name-report.component.less' ],
})
export class WorkOrderNameReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;

  chartInstance: echarts.ECharts;
  chartOptions: echarts.EChartsOption;
  loading = false;
  totalCount = 0;
  reportData: any[] = [];
  chartInitialized = false;
  private resizeObserver: ResizeObserver | null = null;
  private destroy$ = new Subject<void>();
  i18n: any = {};

  // 预定义的颜色数组，用于没有颜色的数据项
  private colorPalette = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#1d1d1d',
    '#6f7a8a', '#a77c5b', '#6b778d', '#c14c53', '#487eb3',
    '#55a37b', '#cb793a', '#7c538c', '#b65f74', '#497e9c',
  ];

  constructor(
    private workOrderService: WorkOrderService,
    private translate: TranslateService
  ) {
    this.initI18n();
  }

  // 初始化国际化
  private initI18n(): void {
    this.translate
      .get('workOrderTicket.report')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18n = res;
        // 如果图表已经初始化，则重新渲染
        if (this.chartInitialized && this.chartInstance && this.reportData && this.reportData.length > 0) {
          this.renderChart(this.reportData);
        }
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
            // 如果图表已经初始化，则重新渲染
            if (this.chartInitialized && this.chartInstance && this.reportData && this.reportData.length > 0) {
              this.renderChart(this.reportData);
            }
          });
      });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // 延迟初始化图表，确保DOM已完全渲染并且宽度已正确计算
    setTimeout(() => {
      this.initChart();
    }, 1000);
  }
  
  ngOnDestroy(): void {
    // 清理资源
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialize the chart instance
  private initChart(): void {
    if (this.chartContainer && this.chartContainer.nativeElement && !this.chartInitialized) {
      try {
        // 确保容器有正确的宽度
        const container = this.chartContainer.nativeElement;
        const containerWidth = container.clientWidth || container.offsetWidth;
        
        if (!containerWidth || containerWidth < 50) {
          // 如果容器宽度不正确，延迟初始化
          setTimeout(() => this.initChart(), 500);
          return;
        }
        
        // 使用明确的宽度初始化图表
        this.chartInstance = echarts.init(container, null, {
          renderer: 'canvas',
          width: containerWidth,
          height: 500
        });
        
        this.chartInitialized = true;

        // If we already have data, render it
        if (this.reportData && this.reportData.length > 0) {
          this.renderChart(this.reportData);
        } else {
          this.renderEmptyChart();
        }

        // 使用ResizeObserver监听容器大小变化
        if (window.ResizeObserver) {
          this.resizeObserver = new ResizeObserver(entries => {
            if (this.chartInstance) {
              const entry = entries[0];
              if (entry && entry.contentRect) {
                const width = entry.contentRect.width;
                if (width > 0) {
                  this.chartInstance.resize({
                    width: width,
                    height: 500
                  });
                }
              }
            }
          });
          
          this.resizeObserver.observe(container);
        } else {
          // 降级方案：使用window resize事件
          const resizeHandler = () => {
            if (this.chartInstance) {
              // 获取容器的实际宽度
              const width = container.clientWidth || container.offsetWidth;
              if (width > 0) {
                this.chartInstance.resize({
                  width: width,
                  height: 500
                });
              }
            }
          };
          
          window.removeEventListener('resize', resizeHandler);
          window.addEventListener('resize', resizeHandler);
        }
        
        // 确保图表在容器大小变化时自动调整大小
        setTimeout(() => {
          if (this.chartInstance) {
            this.chartInstance.resize();
          }
        }, 200);
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    }
  }

  // Public method to refresh the chart - can be called from parent component
  public refresh(): void {
    this.loadData();
  }

  // Public method to check if chart is ready
  public isChartReady(): boolean {
    return this.chartInitialized && !!this.chartInstance;
  }

  // Public method to force chart initialization if needed
  public forceInitChart(): void {
    if (!this.chartInitialized) {
      this.initChart();
    }
  }

  loadData(): void {
    this.loading = true;
    this.workOrderService.getWorkOrderNameReport().subscribe(
      (result) => {
        if (result.success && result.body) {
          this.reportData = result.body;

          // Only render if chart is initialized
          if (this.chartInitialized && this.chartInstance) {
            this.renderChart(result.body);
          }
        } else {
          if (this.chartInitialized && this.chartInstance) {
            this.renderEmptyChart();
          }
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (this.chartInitialized && this.chartInstance) {
          this.renderEmptyChart();
        }
      },
    );
  }

  renderEmptyChart(): void {
    // Check if chart is initialized
    if (!this.chartInitialized || !this.chartInstance) {
      return;
    }

    this.chartOptions = {
      title: {
        text: this.i18n.nameReport || '工单名称统计报表',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: this.i18n.workOrderCount || '工单数量',
          type: 'pie',
          radius: [ '40%', '70%' ],
          center: [ '50%', '50%' ],
          data: [],
          label: {
            show: false,
          },
        },
      ],
    };

    this.chartInstance.setOption(this.chartOptions, true);
    
    // 强制重新计算大小，确保图表正确渲染
    setTimeout(() => {
      if (this.chartInstance) {
        // 获取容器的实际宽度
        const container = this.chartContainer.nativeElement;
        const containerWidth = container.clientWidth || container.offsetWidth;
        
        if (containerWidth > 0) {
          // 重新设置图表大小
          this.chartInstance.resize({
            width: containerWidth,
            height: 500
          });
        }
      }
    }, 300);
  }

  renderChart(data: any[]): void {
    // Check if chart is initialized
    if (!this.chartInitialized || !this.chartInstance) {
      return;
    }

    // 数据验证
    if (!data || !Array.isArray(data) || data.length === 0) {
      this.renderEmptyChart();
      return;
    }

    // 确保每个数据项都有必要的属性，处理字段名称不匹配的问题
    const validData = data.filter(item =>
      item &&
      (typeof item.cName === 'string' || typeof item.cname === 'string') &&
      (item.cName?.trim() !== '' || item.cname?.trim() !== '') &&
      item.value !== undefined &&
      item.value !== null,
    ).map((item, index) => {
      // 处理字段名称不匹配和颜色为null的问题
      return {
        name: item.cName || item.cname,
        value: typeof item.value === 'string' ? parseInt(item.value, 10) : item.value,
        color: item.color || this.colorPalette[index % this.colorPalette.length],
      };
    });

    if (validData.length === 0) {
      this.renderEmptyChart();
      return;
    }

    // 计算总数
    this.totalCount = validData.reduce((sum, item) => {
      return sum + (isNaN(item.value) ? 0 : item.value);
    }, 0);

    // 准备数据
    const formattedData = validData.map(item => {
      const percentage = ((item.value / this.totalCount) * 100).toFixed(2);

      return {
        name: item.name,
        value: item.value,
        percentage: percentage,
        itemStyle: {
          color: item.color,
        },
      };
    });

    // 按数值降序排序
    formattedData.sort((a, b) => b.value - a.value);

    // 计算合适的布局
    const container = this.chartContainer.nativeElement;
    const containerWidth = container.clientWidth || container.offsetWidth;
    
    // 根据容器宽度调整布局
    let centerX = '40%';
    let legendOrient = 'vertical';
    let legendRight = '5%';
    let legendTop = 'middle';
    
    if (containerWidth < 600) {
      // 小屏幕布局
      centerX = '50%';
      legendOrient = 'horizontal';
      legendRight = 'auto';
      legendTop = 'bottom';
    }

    this.chartOptions = {
      title: {
        text: this.i18n.nameReport || '工单名称统计报表',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.seriesName}: ${params.name}<br/>
                 ${this.i18n.workOrderCount || '数量'}: ${params.value} (${params.data.percentage}%)<br/>
                 <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>`;
        },
      },
      legend: {
        type: 'scroll',
        orient: legendOrient as 'horizontal' | 'vertical',
        right: legendRight,
        top: legendTop,
        bottom: legendOrient === 'horizontal' ? 0 : undefined,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
        },
        formatter: (name: string) => {
          const item = formattedData.find(d => d.name === name);
          if (item) {
            return `${name}: ${item.value} (${item.percentage}%)`;
          }
          return name;
        },
        selector: [
          {
            type: 'all',
            title: this.i18n.selectAll || '全选',
          },
          {
            type: 'inverse',
            title: this.i18n.inverse || '反选',
          },
        ],
      },
      series: [
        {
          name: this.i18n.workOrderCount || '工单数量',
          type: 'pie',
          radius: [ '40%', '70%' ],
          center: [ centerX, '50%' ],  // 调整中心位置
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'outside',
            formatter: '{b}: {c} ({d}%)',
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: formattedData,
        },
      ],
      graphic: [
        {
          type: 'text',
          left: centerX,
          top: '50%',  // 调整文本位置
          style: {
            text: `${this.i18n.totalCount || '总计'}\n${this.totalCount}`,
            align: 'center',
            fill: '#333',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
      ],
    };

    this.chartInstance.setOption(this.chartOptions, true);
    
    // 强制重新计算大小，确保图表正确渲染
    setTimeout(() => {
      if (this.chartInstance) {
        // 获取容器的实际宽度
        const container = this.chartContainer.nativeElement;
        const containerWidth = container.clientWidth || container.offsetWidth;
        
        if (containerWidth > 0) {
          // 重新设置图表大小
          this.chartInstance.resize({
            width: containerWidth,
            height: 500
          });
        }
      }
    }, 300);
  }
}
