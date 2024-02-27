import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-rbac',
  template: '<router-outlet></router-outlet>',
})
export class RbacComponent implements AfterViewInit {
  constructor() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
