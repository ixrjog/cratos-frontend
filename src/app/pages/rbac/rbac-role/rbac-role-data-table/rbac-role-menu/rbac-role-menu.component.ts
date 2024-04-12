import { Component, Input, OnInit } from '@angular/core';
import { RbacRoleVO, SaveRoleMenu } from '../../../../../@core/data/rbac';
import { RbacService } from '../../../../../@core/services/rbac.service';
import { MenuService } from '../../../../../@core/services/menu.service';
import { RoleMenuVO } from '../../../../../@core/data/menu';
import { TreeNode } from 'ng-devui';

@Component({
  selector: 'app-rbac-role-menu',
  templateUrl: './rbac-role-menu.component.html',
  styleUrls: [ './rbac-role-menu.component.less' ],
})
export class RbacRoleMenuComponent implements OnInit {

  @Input() data: any;
  formData: RbacRoleVO;
  roleMenu: RoleMenuVO[];
  isChanged: boolean = false;
  menuIds = [];
  loading = false;

  constructor(private menuService: MenuService,
              private rbacService: RbacService) {
  }

  ngOnInit(): void {
    this.loading = true
    this.formData = this.data['formData'];
    const param: { roleId: number; lang: string } = {
      roleId: this.formData.id,
      lang: localStorage.getItem('lang'),
    };
    this.menuService.getRoleMenuByRoleId(param)
      .subscribe(({ body }) => {
        this.roleMenu = body.items;
        this.loading = false
      });
  }

  updateForm() {
    if (this.isChanged) {
      const param: SaveRoleMenu = {
        roleId: this.formData.id,
        menuIds: this.menuIds,
      };
      return this.rbacService.saveRoleMenu(param);
    }
  }

  onNodeChecked(treeNodes: TreeNode[]) {
    this.menuIds = [];
    this.isChanged = true;
    treeNodes.map(node => {
      if (this.menuIds.indexOf(node.id) === -1) {
        this.menuIds.push(node.id);
      }
      if (node.parentId) {
        if (this.menuIds.indexOf(node.parentId) === -1) {
          this.menuIds.push(node.parentId);
        }
      }
    });
  }
}
