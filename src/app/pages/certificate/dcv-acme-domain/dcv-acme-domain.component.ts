import { Component } from '@angular/core';

@Component({
  selector: 'app-dcv-acme-domain',
  template: `
    <da-layout-row [daGutter]="[12, 12]">
      <da-col-item [daSpan]="24" [daXs]="24">
        <div class="app-data-table">
          <app-dcv-acme-domain-data-table></app-dcv-acme-domain-data-table>
        </div>
      </da-col-item>
    </da-layout-row>
  `,
})
export class DcvAcmeDomainComponent {
}
