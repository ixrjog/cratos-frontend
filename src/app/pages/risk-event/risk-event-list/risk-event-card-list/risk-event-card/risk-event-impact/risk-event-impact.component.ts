import { Component, Input } from '@angular/core';
import { RiskEventImpactVO } from '../../../../../../@core/data/risk-event';

@Component({
  selector: 'app-risk-event-impact',
  templateUrl: './risk-event-impact.component.html',
  styleUrls: [ './risk-event-impact.component.less' ],
})
export class RiskEventImpactComponent {

  @Input() riskImpacts: RiskEventImpactVO[];
  protected readonly JSON = JSON;

  getSla(riskEventImpactVO: RiskEventImpactVO): string {
    let result = 'SLA: ';
    if (riskEventImpactVO.costDetail?.cost === 0) {
      return result + '不影响';
    }
    return result + riskEventImpactVO.costDetail.costDesc;
  }
}
