import { Component, Input } from '@angular/core';
import { getPopoverStyle } from '../../../utils/theme.util';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.less'],
})
export class UserPopoverComponent {
  @Input() username: string;
  protected readonly getPopoverStyle = getPopoverStyle;
}
