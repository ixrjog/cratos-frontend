import { Component, Input, OnInit } from '@angular/core';
import { EdsIdentityService } from '../../../../@core/services/ext-dataSource-identity.service';
import {
  EdsCloudAccountVO,
  EdsDingtalkAccountVO,
  EdsGitLabAccountVO,
  EdsLdapAccountVO, EdsMailAccountVO,
} from '../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-identity-settings',
  templateUrl: './user-identity-settings.component.html',
  styleUrls: [ './user-identity-settings.component.less' ],
})
export class UserIdentitySettingsComponent implements OnInit {

  @Input() username: string;

  identity: {
    ldap: EdsLdapAccountVO[],
    gitlab: EdsGitLabAccountVO[],
    dingtalk: EdsDingtalkAccountVO[],
    mail: Map<string, EdsMailAccountVO[]>,
  } = {
    ldap: [],
    gitlab: [],
    dingtalk: [],
    mail: new Map(),
  };


  constructor(private edsIdentityService: EdsIdentityService) {
  }

  fetchData() {
    this.onLdapIdentity();
    this.onGitlabIdentity();
    this.onDingtalkIdentity();
    this.onMailIdentity();
  }

  onLdapIdentity() {
    this.edsIdentityService.queryLdapIdentityDetails({ username: this.username })
      .subscribe(({ body }) => this.identity.ldap = body.ldapIdentities);
  }

  onGitlabIdentity() {
    this.edsIdentityService.queryGitLabIdentityDetails({ username: this.username })
      .subscribe(({ body }) => this.identity.gitlab = body.gitLabIdentities);
  }

  onDingtalkIdentity() {
    this.edsIdentityService.queryDingtalkIdentityDetails({ username: this.username })
      .subscribe(({ body }) => this.identity.dingtalk = body.dingtalkIdentities);
  }

  onMailIdentity() {
    this.edsIdentityService.queryMailIdentityDetails({ username: this.username })
      .subscribe(({ body }) => this.identity.mail = body.accounts);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  protected readonly JSON = JSON;
}
