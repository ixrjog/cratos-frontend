import { Component, OnInit } from '@angular/core';
import { AcmeService } from '../../../../@core/services/acme.service';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-dcv-acme-domain-data-table',
  templateUrl: './dcv-acme-domain-data-table.component.html',
  styleUrls: ['./dcv-acme-domain-data-table.component.less'],
})
export class DcvAcmeDomainDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  /** Optional DCV type filter (the only filter supported by the backend query). */
  dcvType = '';
  /** Client-side filter to show only domains missing the DCV record. */
  onlyMissing = false;
  loading = false;

  /** Backend returns a plain list of ACME domains. */
  data: any[] = [];

  constructor(private acmeService: AcmeService, private toastUtil: ToastUtil) {
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.acmeService.queryHasDcvAcmeDomain({
      dcvType: this.dcvType || undefined,
      page: 1,
      length: 500,
    }).subscribe(({ body }) => {
      this.data = body || [];
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onSearch() {
    this.fetchData();
  }

  onRecoverDcv(rowItem: any) {
    this.acmeService.recoverDcvDelegation({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
        this.fetchData();
      });
  }

  get displayData(): any[] {
    return this.onlyMissing ? this.data.filter(d => !d['hasDcvRecord']) : this.data;
  }

}
