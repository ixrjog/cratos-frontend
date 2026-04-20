import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.less'],
})
export class OrganizationListComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
