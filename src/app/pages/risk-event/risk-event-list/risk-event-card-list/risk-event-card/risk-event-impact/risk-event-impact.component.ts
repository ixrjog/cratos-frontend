import { Component, Input } from '@angular/core';
import { RiskEventImpactVO } from '../../../../../../@core/data/risk-event';

@Component({
  selector: 'app-risk-event-impact',
  templateUrl: './risk-event-impact.component.html',
  styleUrls: [ './risk-event-impact.component.less' ],
})
export class RiskEventImpactComponent {

  @Input() riskImpacts: RiskEventImpactVO[];


}
