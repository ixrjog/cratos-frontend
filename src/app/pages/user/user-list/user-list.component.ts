import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements AfterViewInit {
  constructor() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
