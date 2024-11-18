import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-application-resources',
  templateUrl: './application-resources.component.html',
  styleUrls: [ './application-resources.component.less' ],
})
export class ApplicationResourcesComponent {

  private _resources: any;

  @Input()

  set resources(value) {
    this._resources = JSON.parse(JSON.stringify(value));
  }

  get resources() {
    return this._resources;
  }

  showDisplayName(value) {
    switch (value.resourceType) {
      case 'GITLAB_PROJECT':
        return value.displayName;
      case 'KUBERNETES_DEPLOYMENT':
      case 'KUBERNETES_SERVICE':
        return value.displayName + '@' + value.instanceName;
      default:
        return value.displayName;
    }
  }

}
