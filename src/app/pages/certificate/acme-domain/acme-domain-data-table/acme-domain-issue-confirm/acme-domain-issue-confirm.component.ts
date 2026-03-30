import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acme-domain-issue-confirm',
  template: `<div *ngIf="mdContent"><markdown [data]="mdContent"></markdown></div>`,
})
export class AcmeDomainIssueConfirmComponent implements OnInit {

  @Input() data: any;
  mdContent: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    const formData = this.data['formData'];
    this.http.get('assets/acme-issue-confirm.md', { responseType: 'text' })
      .subscribe(md => {
        this.mdContent = md
          .replace('{{domain}}', formData.domain || '')
          .replace('{{domains}}', formData.domains || '');
      });
  }

}
