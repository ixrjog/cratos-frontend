import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-channel-network-list',
  templateUrl: './channel-network-list.component.html',
  styleUrls: ['./channel-network-list.component.less']
})
export class ChannelNetworkListComponent implements AfterViewInit {
  constructor() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
