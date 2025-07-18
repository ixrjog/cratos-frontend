// 添加ResizeObserver类型声明
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { WorkOrderService } from '../../../../../@core/services/work-order.service';
import { WorkOrderReportMonthlyVO } from '../../../../../@core/data/work-order';
import * as echarts from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-work-order-month-report',
  templateUrl: './work-order-month-report.component.html',
  styleUrls: [ './work-order-month-report.component.less' ],
})
export class WorkOrderMonthReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;

  chartInstance: echarts.ECharts;
  chartOptions: any; // Use any type to avoid TypeScript errors
  loading = false;
  reportData: WorkOrderReportMonthlyVO;
  timeRangeText = '';
  chartInitialized = false;

  private destroy$ = new Subject<void>();
  i18n: any = {};

  constructor(
    private workOrderService: WorkOrderService,
    private translate: TranslateService
  ) {
    this.initI18n();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // 延迟初始化图表，确保DOM已完全渲染并且宽度已正确计算
    setTimeout(() => {
      this.initChart();
    }, 1000);

    // 监听窗口大小变化，重新添加标记
    window.addEventListener('resize', () => {
      if (this.chartInstance && this.reportData && this.reportData.dates) {
        setTimeout(() => {
          this.addTimeAxisMarkers();
        }, 300);
      }
    });
  }

  private resizeObserver: ResizeObserver | null = null;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // 清理ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // 清理图表实例
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }

  // 初始化国际化
  private initI18n(): void {
    this.translate
      .get('workOrderTicket.report')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18n = res;
        // 如果图表已经初始化，则重新渲染
        if (this.chartInitialized && this.chartInstance && this.reportData) {
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
            if (this.chartInitialized && this.chartInstance && this.reportData) {
              this.renderChart(this.reportData);
            }
          });
      });
  }

  // 初始化图表
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

        // 使用更多选项初始化图表
        this.chartInstance = echarts.init(container, null, {
          renderer: 'canvas',
          useDirtyRect: false,
          width: containerWidth,
          height: 600
        });

        this.chartInitialized = true;

        // 如果已经有数据，渲染图表
        if (this.reportData) {
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
                    height: 600
                  });

                  // 重新添加时间标记
                  if (this.reportData && this.reportData.dates) {
                    setTimeout(() => {
                      this.addTimeAxisMarkers();
                    }, 300);
                  }
                }
              }
            }
          });

          this.resizeObserver.observe(container);
        } else {
          // 降级方案：使用window resize事件
          const resizeHandler = () => {
            if (this.chartInstance) {
              this.chartInstance.resize();

              // 重新添加时间标记
              if (this.reportData && this.reportData.dates) {
                setTimeout(() => {
                  this.addTimeAxisMarkers();
                }, 300);
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
        // 错误处理
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
    this.workOrderService.getWorkOrderMonthlyReport().subscribe(
      (result) => {
        if (result.success && result.body) {
          this.reportData = result.body;

          // 只有在图表已初始化的情况下才渲染
          if (this.chartInitialized && this.chartInstance) {
            this.renderChart(result.body);
          }

          // 设置时间范围文本
          if (result.body.dates && result.body.dates.length > 0) {
            const firstDate = result.body.dates[0];
            const lastDate = result.body.dates[result.body.dates.length - 1];
            this.timeRangeText = `${this.i18n.timeRange || '时间范围'}：${firstDate} - ${lastDate}`;
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
    // 检查图表是否已初始化
    if (!this.chartInitialized || !this.chartInstance) {
      return;
    }

    this.chartOptions = {
      title: {
        text: this.i18n.monthlyReport || '工单月度统计报表',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        type: 'value',
        name: this.i18n.workOrderCount || '工单数量',
      },
      series: [],
    };

    this.chartInstance.setOption(this.chartOptions as any, true);
  }

  renderChart(data: WorkOrderReportMonthlyVO): void {
    // 检查图表是否已初始化
    if (!this.chartInitialized || !this.chartInstance) {
      return;
    }

    // 数据验证
    if (!data || !data.dates || !Array.isArray(data.dates) || data.dates.length === 0 || !data.nameCat) {
      this.renderEmptyChart();
      return;
    }

    try {
      // 将Map转换为数组以便处理
      const nameCatEntries = Object.entries(data.nameCat || {});

      if (nameCatEntries.length === 0) {
        this.renderEmptyChart();
        return;
      }

      const legendData = [];
      const series = [];

      // 计算每个月份的总数，用于堆叠百分比
      const monthlyTotals = new Array(data.dates.length).fill(0);

      // 首先计算每个月的总数
      for (const [name, stats] of nameCatEntries) {
        if (!name || typeof name !== 'string' || !stats || !Array.isArray(stats.values)) {
          continue;
        }

        stats.values.forEach((value, index) => {
          if (index < monthlyTotals.length) {
            monthlyTotals[index] += (typeof value === 'number' ? value : 0);
          }
        });
      }

      // 然后创建系列数据
      for (const [name, stats] of nameCatEntries) {
        if (!name || typeof name !== 'string' || !stats || !Array.isArray(stats.values)) {
          continue;
        }

        legendData.push(name);

        series.push({
          name: name,
          type: 'bar',
          stack: 'total',
          barWidth: '50%',  // 调整柱宽
          barGap: '10%',    // 调整柱间距
          emphasis: {
            focus: 'series'
          },
          data: stats.values,
          itemStyle: {
            color: stats.color || undefined,
            borderRadius: [2, 2, 0, 0]  // 添加圆角
          },
          label: {
            show: false,
            formatter: (params: any) => {
              return params.value > 0 ? params.value : '';
            }
          }
        });
      }

      if (series.length === 0) {
        this.renderEmptyChart();
        return;
      }

      // 格式化日期标签，使其更简洁
      const formattedDates = data.dates.map(date => {
        // 假设日期格式为 "YYYY-MM"
        const parts = date.split('-');
        if (parts.length === 2) {
          return `${parts[0].substring(2)}-${parts[1]}`;  // 只显示年份的后两位
        }
        return date;
      });

      // 根据日期数量决定是否显示所有标签
      const interval = formattedDates.length > 24 ? 1 : 0;

      // 选择关键时间点作为标记
      const keyTimePoints = this.selectKeyTimePoints(formattedDates);

      this.chartOptions = {
        title: {
          text: this.i18n.monthlyReport || '工单月度统计报表',
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          },
          subtext: this.timeRangeText,
          subtextStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params: any) => {
            let tooltip = `${params[0].axisValue}<br/>`;
            let total = 0;

            params.forEach((param: any) => {
              tooltip += `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span> ${param.seriesName}: ${param.value}<br/>`;
              total += param.value;
            });

            tooltip += `<br/><b>${this.i18n.totalCount || '总计'}: ${total}</b>`;
            return tooltip;
          }
        },
        legend: {
          data: legendData,
          type: 'scroll',
          bottom: 60,
          pageButtonPosition: 'end',
          pageButtonGap: 5,
          pageButtonItemGap: 5,
          pageIconColor: '#888',
          pageIconInactiveColor: '#ccc',
          pageIconSize: 12,
          pageTextStyle: {
            color: '#333'
          },
          selector: [
            {
              type: 'all',
              title: this.i18n.selectAll || '全选'
            },
            {
              type: 'inverse',
              title: this.i18n.inverse || '反选'
            }
          ]
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: 100,
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: formattedDates,
          axisLabel: {
            interval: 0,  // 显示所有标签
            rotate: 45,   // 旋转标签
            fontSize: 10,
            margin: 8,
            hideOverlap: true,
            align: 'right'
          },
          axisTick: {
            alignWithLabel: true
          },
          position: 'bottom'
        },
        yAxis: {
          type: 'value',
          name: this.i18n.workOrderCount || '工单数量',
          minInterval: 1,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: [0],
            start: 0,
            end: 100,
            height: 25,
            bottom: 10,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#5470c6'
            },
            textStyle: {
              color: '#333'
            },
            borderColor: '#ccc',
            backgroundColor: '#f7f7f7',
            fillerColor: 'rgba(84,112,198,0.2)',
            moveHandleSize: 6
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100,
            zoomOnMouseWheel: true
          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {
              title: this.i18n.saveAsImage || '保存为图片'
            },
            dataView: {
              title: this.i18n.dataView || '数据视图',
              readOnly: true
            },
            magicType: {
              type: ['line', 'bar', 'stack'],
              title: {
                line: this.i18n.switchToLine || '切换为折线图',
                bar: this.i18n.switchToBar || '切换为柱状图',
                stack: this.i18n.switchToStack || '切换为堆叠'
              }
            },
            restore: {
              title: this.i18n.restore || '还原'
            }
          },
          right: 20,
          top: 20
        },
        series: series
      };

      // 添加关键时间点标记
      if (keyTimePoints.length > 0) {
        const markLines: any = {
          silent: true,
          symbol: ['none', 'none'],
          label: {
            show: true,
            position: 'insideBottom',
            formatter: '{b}',
            fontSize: 10,
            color: '#666',
            backgroundColor: 'rgba(255,255,255,0.7)',
            padding: [2, 4]
          },
          lineStyle: {
            type: 'dashed' as 'solid' | 'dashed' | 'dotted',  // 使用联合类型断言
            color: '#ccc',
            width: 1
          },
          data: keyTimePoints.map(point => ({
            xAxis: point.index,
            name: point.date
          }))
        };

        // 将标记线添加到第一个系列
        if (this.chartOptions.series && Array.isArray(this.chartOptions.series) && this.chartOptions.series.length > 0) {
          // 使用更激进的类型断言来避免类型错误
          this.chartOptions.series[0] = {
            ...(this.chartOptions.series[0] as any),
            markLine: markLines
          } as any;
        }
      }

      // 清除之前的事件监听器
      this.chartInstance.off('datazoom');

      // 设置图表选项
      this.chartInstance.setOption(this.chartOptions as any, true);

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
              height: 600
            });
          }

          // 添加时间标记
          this.addTimeAxisMarkers();
        }
      }, 500);

      // 添加dataZoom事件监听器
      this.chartInstance.on('datazoom', (params) => {
        // 可以在这里添加时间条变化时的处理逻辑
      });

      // 添加点击事件
      this.chartInstance.on('click', (params) => {
        // 这里可以添加点击后的操作，如显示详情等
      });
    } catch (error) {
      this.renderEmptyChart();
    }
  }

  // 选择关键时间点
  private selectKeyTimePoints(dates: string[]): { date: string, index: number }[] {
    if (!dates || dates.length === 0) {
      return [];
    }

    const result = [];
    const totalDates = dates.length;

    // 如果日期太多，只选择开始、结束和几个中间点
    if (totalDates > 12) {
      // 添加开始日期
      result.push({ date: dates[0], index: 0 });

      // 添加中间日期
      const middlePoints = [0.25, 0.5, 0.75];
      middlePoints.forEach(point => {
        const index = Math.floor(totalDates * point);
        if (index > 0 && index < totalDates - 1) {
          result.push({ date: dates[index], index });
        }
      });

      // 添加结束日期
      result.push({ date: dates[totalDates - 1], index: totalDates - 1 });
    } else {
      // 如果日期不多，可以显示更多标记点
      const step = Math.max(1, Math.floor(totalDates / 6));
      for (let i = 0; i < totalDates; i += step) {
        result.push({ date: dates[i], index: i });
      }

      // 确保最后一个日期也有标记
      const lastIndex = totalDates - 1;
      if (lastIndex % step !== 0) {
        result.push({ date: dates[lastIndex], index: lastIndex });
      }
    }

    return result;
  }

  // 添加自定义时间轴标记
  private addTimeAxisMarkers(): void {
    try {
      // 获取时间标记容器
      const markerContainer = document.getElementById('timeMarkersContainer');
      if (!markerContainer) {
        return;
      }

      // 清空现有标记
      markerContainer.innerHTML = '';

      const dates = this.reportData.dates;
      if (!dates || dates.length === 0) {
        return;
      }

      // 选择要显示的关键时间点
      const keyPoints = this.selectKeyTimePoints(dates);

      // 添加标记
      keyPoints.forEach(point => {
        const position = (point.index / (dates.length - 1)) * 100;

        const marker = document.createElement('div');
        marker.className = 'time-marker';
        marker.style.left = `${position}%`;
        marker.style.position = 'absolute';
        marker.style.transform = 'translateX(-50%)';
        marker.style.pointerEvents = 'none'; // 确保标记不会干扰鼠标事件
        marker.style.zIndex = '0'; // 确保标记在时间条下方

        // 添加标记线
        const line = document.createElement('div');
        line.className = 'marker-line';
        line.style.width = '2px';
        line.style.height = '8px';
        line.style.backgroundColor = '#666';
        line.style.margin = '0 auto';
        marker.appendChild(line);

        // 添加标记标签
        const label = document.createElement('div');
        label.className = 'marker-label';
        label.textContent = point.date;
        label.style.fontSize = '10px';
        label.style.color = '#666';
        label.style.whiteSpace = 'nowrap';
        label.style.textAlign = 'center';
        marker.appendChild(label);

        markerContainer.appendChild(marker);
      });

      // 调整ECharts数据缩放控件的大小
      this.adjustDataZoomSize();
    } catch (error) {
      // 错误处理
    }
  }

  // 调整数据缩放控件的大小
  private adjustDataZoomSize(): void {
    try {
      // 等待ECharts渲染完成
      setTimeout(() => {
        // 获取数据缩放控件元素
        const dataZoomSlider = document.querySelector('.echarts-data-zoom-slider') as HTMLElement;
        if (dataZoomSlider) {
          // 设置较小的高度
          dataZoomSlider.style.height = '25px';

          // 调整数据缩放控件内部元素的高度
          const handles = document.querySelectorAll('.echarts-data-zoom-handle') as NodeListOf<HTMLElement>;
          handles.forEach(handle => {
            handle.style.height = '25px';
          });

          const mask = document.querySelector('.echarts-data-zoom-mask') as HTMLElement;
          if (mask) {
            mask.style.height = '25px';
          }

          // 更新图表以应用更改
          if (this.chartInstance) {
            this.chartInstance.resize();
          }
        }
      }, 300);
    } catch (error) {
      // 错误处理
    }
  }
}
