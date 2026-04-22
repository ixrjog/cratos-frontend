import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getPopoverStyle } from '../../../utils/theme.util';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.less'],
})
export class UserPopoverComponent {
  @Input() username: string;
  @Input() deletable = false;
  @Output() onDelete = new EventEmitter<string>();
  protected readonly getPopoverStyle = getPopoverStyle;
}
