import { Component, Input } from '@angular/core';
import { BusinessTagVO } from '../../../../@core/data/business-tag';


@Component({
  selector: 'app-business-tags',
  templateUrl: './business-tags.component.html',
  styleUrls: [ './business-tags.component.less' ],
})
export class BusinessTagsComponent {

  @Input()
  businessTags: BusinessTagVO[];

}
