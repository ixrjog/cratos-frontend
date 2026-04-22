import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-channel-line-list',
  templateUrl: './channel-line-list.component.html',
  styleUrls: ['./channel-line-list.component.less'],
})
export class ChannelLineListComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
