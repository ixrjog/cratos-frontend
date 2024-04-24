import { Component, OnInit } from '@angular/core';
import { RiskEventService } from '../../../../@core/services/risk-event.service';
import { RiskEventGraphQuery, RiskEventGraphVO } from '../../../../@core/data/risk-event';
import { TagPageQuery } from '../../../../@core/data/tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-risk-event-chart',
  templateUrl: './risk-event-chart.component.html',
  styleUrls: [ './risk-event-chart.component.less' ],
})
export class RiskEventChartComponent implements OnInit {

  constructor(private riskEventService: RiskEventService) {
  }

  queryParam = {
    year: '',
    quarter: '',
  };

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
    const param: TagPageQuery = {
      length: 20, page: 1, tagKey: term,
    };
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
    const param: RiskEventGraphQuery = {
      ...this.queryParam,
    };
    this.riskEventService.queryRiskEventGraph(param)
      .subscribe(({ body }) => {
        this.riskEventGraph = body;
        this.showChart = true;
      });
  }

  protected readonly JSON = JSON;
}
