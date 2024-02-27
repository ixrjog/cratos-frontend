import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: [ './certificate-list.component.less' ],
})
export class CertificateListComponent implements AfterViewInit {
  constructor() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
