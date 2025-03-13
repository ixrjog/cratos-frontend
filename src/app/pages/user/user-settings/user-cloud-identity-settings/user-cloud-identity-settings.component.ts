import { Component, Input, OnInit } from '@angular/core';
import {
  EdsCloudAccountVO, EdsDingtalkAccountVO,
  EdsGitLabAccountVO,
  EdsLdapAccountVO, EdsMailAccountVO,
} from '../../../../@core/data/ext-dataSource-identity';
import { EdsIdentityService } from '../../../../@core/services/ext-dataSource-identity.service';

@Component({
  selector: 'app-user-cloud-identity-settings',
  templateUrl: './user-cloud-identity-settings.component.html',
  styleUrls: ['./user-cloud-identity-settings.component.less']
})
export class UserCloudIdentitySettingsComponent implements OnInit {

  @Input() username: string;

  cloudIdentity:  Map<string, EdsCloudAccountVO[]> = new Map();

  constructor(private edsIdentityService: EdsIdentityService) {
  }

  fetchData() {
    this.onCloudIdentity();
  }

  onCloudIdentity() {
    this.edsIdentityService.queryCloudIdentityDetails({ username: this.username })
      .subscribe(({ body }) => this.cloudIdentity = body.accounts);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  protected readonly JSON = JSON;
}
