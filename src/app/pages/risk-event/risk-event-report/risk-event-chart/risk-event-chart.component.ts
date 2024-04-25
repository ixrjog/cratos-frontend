import { Component, OnInit } from '@angular/core';
import { RiskEventService } from '../../../../@core/services/risk-event.service';
import { RiskEventGraphQuery, RiskEventGraphVO } from '../../../../@core/data/risk-event';
import { TagPageQuery } from '../../../../@core/data/tag';
import { map } from 'rxjs/operators';
import { TagService } from '../../../../@core/services/tag.service';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { BusinessTagService } from '../../../../@core/services/business-tag.service';

@Component({
  selector: 'app-risk-event-chart',
  templateUrl: './risk-event-chart.component.html',
  styleUrls: [ './risk-event-chart.component.less' ],
})
export class RiskEventChartComponent implements OnInit {

  constructor(private riskEventService: RiskEventService,
              private tagService: TagService,
              private businessTagService: BusinessTagService) {
  }

  stickyView = {
    top: 160,
    bottom: 0,
  };

  queryParam = {
    year: '',
    quarter: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  tagOptions = [];
  tags = [];

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
    this.getTagOptions();
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

  queryBusinessTagByValue(tagId: number) {
    return new Promise(() => {
      this.businessTagService.queryBusinessTagByValue({ tagId: tagId })
        .subscribe();
    });
  }

  getTagOptions() {
    this.tagService.queryTagByBusinessType({ businessType: BusinessTypeEnum.RISK_EVENT_IMPACT })
      .subscribe(({ body }) => {
        body.map(tag => {
          this.businessTagService.queryBusinessTagByValue({ tagId: tag.id })
            .subscribe(({ body }) => {
              let child = [];
              body.map(value => {
                child.push({
                  label: tag.tagKey + ': ' + value,
                  value: value,
                });
              });
              this.tagOptions.push({
                label: tag.tagKey,
                value: tag.id,
                children: child,
              });
            });
        });
      });
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
          console.log(this.finLosses)
        }
      });
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag.tagId = null;
    this.queryParam.queryByTag.tagValue = null;
    if (value[0]) {
      this.queryParam.queryByTag.tagId = value[0];
    }
    if (value[1]) {
      this.queryParam.queryByTag.tagValue = value[1];
    }
  }

  protected readonly JSON = JSON;
}
