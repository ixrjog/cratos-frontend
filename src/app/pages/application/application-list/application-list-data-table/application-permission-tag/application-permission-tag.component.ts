import { Component, Input } from '@angular/core';
import { UserPermissionBusinessVO } from '../../../../../@core/data/user-permission';

@Component({
  selector: 'app-application-permission-tag',
  templateUrl: './application-permission-tag.component.html',
  styleUrls: ['./application-permission-tag.component.less']
})
export class ApplicationPermissionTagComponent {

  @Input() permissions: Map<string, UserPermissionBusinessVO[]>;

  protected readonly JSON = JSON;

  getProgressColor(expiredTime: Date): string {
    if (!expiredTime) return '#5e9629';
    const daysDiff = Math.ceil((new Date(expiredTime).getTime() - Date.now()) / 86400000);
    if (daysDiff < 0) return '#ff4d4f';
    if (daysDiff <= 7) return '#ffa940';
    return '#5e9629';
  }

  isExpired(expiredTime: Date): boolean {
    if (!expiredTime) return false;
    return new Date(expiredTime).getTime() < Date.now();
  }

  getCompactExpirationText(expiredTime: Date): string {
    if (!expiredTime) return '';
    const daysDiff = Math.ceil((new Date(expiredTime).getTime() - Date.now()) / 86400000);
    if (daysDiff < 0) return `${Math.abs(daysDiff)}d ago`;
    return `${daysDiff}d`;
  }
}
