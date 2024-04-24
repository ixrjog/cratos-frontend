import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { RiskEventGraphVO } from '../../../../../@core/data/risk-event';

@Component({
  selector: 'app-risk-event-pie-chart',
  templateUrl: './risk-event-pie-chart.component.html',
  styleUrls: [ './risk-event-pie-chart.component.less' ],
})
export class RiskEventPieChartComponent implements OnChanges {

  @Input() riskEventGraph: RiskEventGraphVO;

  ngOnChanges() {
    let data = [];
    data.push({
      value: this.riskEventGraph.slaPieGraph.cost,
      name: 'Unavailability',
    });
    data.push({
      value: this.riskEventGraph.slaPieGraph.total - this.riskEventGraph.slaPieGraph.cost,
      name: 'Availability',
      selected: true,
    });
    this.initChart(data);
  }

  initChart(data: any[]) {
    type EChartsOption = echarts.EChartsOption;
    let chartDom = document.getElementById('riskEventPieChart')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    option = {
      title: {
        text: 'Risk Event Report',
        subtext: 'SLA Data',
        left: 'left',
      },
      color: [ '#f66f6a', '#50d4ab' ],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            length: 30
          },
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: 33
              },
              per: {
                color: '#fff',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4
              }
            }
          },
          data: data,
        },
      ],
    };
    option && myChart.setOption(option, true);
  }

}
