import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: [ './certificate-list.component.less' ],
})
export class CertificateListComponent implements OnInit, AfterViewInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
