import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-channel-business-list',
  templateUrl: './channel-business-list.component.html',
  styleUrls: ['./channel-business-list.component.less'],
})
export class ChannelBusinessListComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
