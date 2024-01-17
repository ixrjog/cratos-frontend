import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate-manage',
  templateUrl: './certificate-manage.component.html',
  styleUrls: [ './certificate-manage.component.less' ],
})
export class CertificateManageComponent implements OnInit, AfterViewInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
