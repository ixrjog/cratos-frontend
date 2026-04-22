import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-channel-info-list',
  templateUrl: './channel-info-list.component.html',
  styleUrls: ['./channel-info-list.component.less'],
})
export class ChannelInfoListComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
