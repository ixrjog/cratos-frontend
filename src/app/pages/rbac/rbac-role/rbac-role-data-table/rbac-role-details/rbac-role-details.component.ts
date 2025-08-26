import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RbacService } from '../../../../../@core/services/rbac.service';
import { RbacRoleVO, RoleDetailsVO, RoleGroupResourceVO } from '../../../../../@core/data/rbac';

@Component({
  selector: 'app-rbac-role-details',
  templateUrl: './rbac-role-details.component.html',
  styleUrls: [ './rbac-role-details.component.less' ],
})
export class RbacRoleDetailsComponent implements OnInit {

  @Input() data: any;
  formData: RbacRoleVO;
  roleDetails: RoleDetailsVO;

  constructor(
    private rbacService: RbacService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.formData = this.data['formData'];
    this.fetchDate();
  }

  fetchDate() {
    this.roleDetails = null
    this.rbacService.queryRoleDetails({roleId: this.formData.id})
      .subscribe({
        next: ({ body }) => {
          console.log('Role details response:', body);
          this.roleDetails = body;
          
          // 调试信息
          if (this.roleDetails) {
            console.log('Role details loaded:', this.roleDetails);
            console.log('Group resources:', this.roleDetails.groupResources);
            if (this.roleDetails.groupResources) {
              this.roleDetails.groupResources.forEach((gr, index) => {
                console.log(`Group ${index}:`, gr.group);
                console.log(`Resources ${index}:`, gr.resources);
              });
            }
          }
        },
        error: (error) => {
          console.error('Error fetching role details:', error);
          this.roleDetails = null;
        }
      })
  }

  /**
   * 获取访问级别对应的DevUI标签类型
   */
  getAccessLevelType(accessLevel: number): string {
    switch (accessLevel) {
      case 0:
        return 'danger';
      case 1:
        return 'warning';
      case 2:
        return 'info';
      case 3:
        return 'success';
      default:
        return 'common';
    }
  }

  /**
   * 获取访问级别对应的标签样式
   */
  getAccessLevelStyle(accessLevel: number): string {
    switch (accessLevel) {
      case 0:
        return 'red-w98';
      case 1:
        return 'orange-w98';
      case 2:
        return 'blue-w98';
      case 3:
        return 'green-w98';
      default:
        return 'gray-w98';
    }
  }

  /**
   * 获取访问级别对应的文本
   */
  getAccessLevelText(accessLevel: number): string {
    switch (accessLevel) {
      case 0:
        return this.translate.instant('rbacRoleDetails.accessLevel.none');
      case 1:
        return this.translate.instant('rbacRoleDetails.accessLevel.readonly');
      case 2:
        return this.translate.instant('rbacRoleDetails.accessLevel.readwrite');
      case 3:
        return this.translate.instant('rbacRoleDetails.accessLevel.admin');
      default:
        return this.translate.instant('rbacRoleDetails.accessLevel.unknown');
    }
  }

  /**
   * 获取组头部显示文本
   */
  getGroupHeader(groupResource: RoleGroupResourceVO): string {
    const groupName = groupResource.group?.groupName || this.translate.instant('rbacRoleDetails.resourcePermissions.groupName');
    const resourceCount = groupResource.resources?.length || 0;
    const resourcesText = this.translate.instant('rbacRoleDetails.resourcePermissions.resources');
    return `${groupName} (${resourceCount}${resourcesText})`;
  }

  /**
   * 用于ngFor的trackBy函数，提高性能
   */
  trackByGroupId(index: number, item: RoleGroupResourceVO): number {
    return item.group?.id || index;
  }

  /**
   * 调试方法：获取资源数组的类型信息
   */
  getResourcesType(resources: any): string {
    if (!resources) return 'null/undefined';
    if (Array.isArray(resources)) return `Array[${resources.length}]`;
    return typeof resources;
  }

}
