import { Component, Input, OnInit } from '@angular/core';
import { RbacService } from '../../../../../@core/services/rbac.service';
import { RbacRoleVO, RoleDetailsVO } from '../../../../../@core/data/rbac';
import { getRowColor } from '../../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-rbac-role-details',
  templateUrl: './rbac-role-details.component.html',
  styleUrls: [ './rbac-role-details.component.less' ],
})
export class RbacRoleDetailsComponent implements OnInit {

  @Input() data: any;
  formData: RbacRoleVO;
  roleDetails: RoleDetailsVO;
  protected readonly getRowColor = getRowColor;

  constructor(private rbacService: RbacService,) {
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
          this.roleDetails = body;
        },
        error: (error) => {
          this.roleDetails = null;
        }
      })
  }

}
