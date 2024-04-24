import { Component, Input, OnChanges } from '@angular/core';
import { RiskEventGraphVO } from '../../../../../@core/data/risk-event';
import * as echarts from 'echarts';

@Component({
  selector: 'app-risk-event-impact-bar-chart',
  templateUrl: './risk-event-impact-bar-chart.component.html',
  styleUrls: [ './risk-event-impact-bar-chart.component.less' ],
})
export class RiskEventImpactBarChartComponent implements OnChanges {

  @Input() riskEventGraph: RiskEventGraphVO;

  ngOnChanges() {
    let xData = [];
    let yData = [];
    this.riskEventGraph.monthlySlaCostBarGraph.data.map(res => {
      xData.push(res.cname);
      yData.push(res.value);
    });
    this.initChart(xData, yData);
  }

  initChart(xData: any[], yData: any[]) {
    type EChartsOption = echarts.EChartsOption;
    let chartDom = document.getElementById('riskEventImpactBarChart')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    option = {
      title: {
        text: 'Risk Event Impact Report',
        subtext: 'Unavailability Duration (s)',
        left: 'left',
      },
      color: [ '#f66f6a' ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      label: {
        show: true,
        position: 'top'
      },
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: yData,
        },
      ],
    };
    option && myChart.setOption(option, true);
  }

}
