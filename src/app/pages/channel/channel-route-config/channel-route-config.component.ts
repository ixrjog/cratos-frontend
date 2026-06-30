import { Component } from '@angular/core';

@Component({
  selector: 'app-channel-route-config',
  template: `
    <da-layout-row [daGutter]="[12, 12]">
      <da-col-item [daSpan]="24" [daXs]="24">
        <div class="app-data-table">
          <app-channel-route-config-data-table></app-channel-route-config-data-table>
        </div>
      </da-col-item>
    </da-layout-row>
  `,
})
export class ChannelRouteConfigComponent {
}
