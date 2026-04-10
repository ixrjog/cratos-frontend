import { Component, OnInit } from '@angular/core';
import { ApiSecurityRiskService } from '../../../@core/services/api-security-risk.service';

@Component({
  selector: 'app-api-security-risk-report',
  templateUrl: './api-security-risk-report.component.html',
  styleUrls: ['./api-security-risk-report.component.less'],
})
export class ApiSecurityRiskReportComponent implements OnInit {

  report: any = null;
  loading = true;

  constructor(private apiSecurityRiskService: ApiSecurityRiskService) {
  }

  ngOnInit() {
    this.apiSecurityRiskService.getReport()
      .subscribe(({ body }) => {
        this.report = body;
        this.loading = false;
      });
  }

  getRiskLevelColor(level: string): string {
    switch (level) {
      case 'CRITICAL': return '#f66f6a';
      case 'HIGH': return '#f66f6a';
      case 'MEDIUM': return '#fa9841';
      case 'LOW': return '#5e7ce0';
      default: return '#999';
    }
  }

  getProgressColor(progress: string): string {
    switch (progress) {
      case 'FIXED': return '#3ac295';
      case 'CONFIRMED': return '#5e7ce0';
      case 'CONFIRMING': return '#fa9841';
      case 'PENDING': return '#f66f6a';
      default: return '#999';
    }
  }

}
