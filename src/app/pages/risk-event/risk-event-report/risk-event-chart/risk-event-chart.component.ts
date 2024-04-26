import { Component, OnInit } from '@angular/core';
import { RiskEventService } from '../../../../@core/services/risk-event.service';
import { RiskEventGraphQuery, RiskEventGraphVO } from '../../../../@core/data/risk-event';
import { map } from 'rxjs/operators';
import { BusinessTypeEnum } from '../../../../@core/data/business';

@Component({
  selector: 'app-risk-event-chart',
  templateUrl: './risk-event-chart.component.html',
  styleUrls: [ './risk-event-chart.component.less' ],
})
export class RiskEventChartComponent implements OnInit {

  constructor(private riskEventService: RiskEventService) {
  }

  stickyView = {
    top: 160,
    bottom: 0,
  };

  businessType = BusinessTypeEnum.RISK_EVENT_IMPACT;

  queryParam = {
    year: '',
    quarter: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  finLosses: Map<string, number> = null;

  riskEventGraph: RiskEventGraphVO = null;
  showChart = false;

  quarterOptions = [
    { name: 'Q1', value: '1' },
    { name: 'Q2', value: '2' },
    { name: 'Q3', value: '3' },
    { name: 'Q4', value: '4' },
  ];

  ngOnInit() {
    this.queryParam.year = new Date().getFullYear().toString();
    this.fetchData();
  }

  onSearchYear = (term: string) => {
    return this.riskEventService.getYearOptions()
      .pipe(
        map(({ body }) =>
          body.options.map((year, index) => ({ id: index, option: year })),
        ),
      );
  };

  onYearChange(year: any) {
    this.queryParam.year = year.value;
  }

  fetchData() {
    this.finLosses = null;
    const param: RiskEventGraphQuery = {
      ...this.queryParam,
    };
    this.riskEventService.queryRiskEventGraph(param)
      .subscribe(({ body }) => {
        this.riskEventGraph = body;
        this.showChart = true;
        if (this.riskEventGraph.finLosses.data) {
          this.finLosses = new Map<string, number>(Object.entries(this.riskEventGraph.finLosses.data));
        }
      });
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  protected readonly JSON = JSON;
}
