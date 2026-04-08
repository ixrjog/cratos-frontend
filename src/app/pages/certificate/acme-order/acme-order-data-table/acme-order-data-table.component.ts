import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AcmeDomainPageQuery, AcmeDomainVO, AcmeOrderPageQuery, AcmeOrderVO, AcmeService } from '../../../../@core/services/acme.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { map } from 'rxjs/operators';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
// @ts-ignore
import * as JSZip from 'jszip';

@Component({
  selector: 'app-acme-order-data-table',
  templateUrl: './acme-order-data-table.component.html',
  styleUrls: ['./acme-order-data-table.component.less'],
})
export class AcmeOrderDataTableComponent implements OnInit {

  private static readonly DOMAIN_STORAGE_KEY = 'acme_order_selected_domain';

  protected readonly limit = RELATIVE_TIME_LIMIT;

  selectedDomain: AcmeDomainVO;

  queryParam = {
    acmeDomainId: null as number,
  };

  table: Table<AcmeOrderVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  certificate: any = null;

  constructor(private acmeService: AcmeService, private dialogUtil: DialogUtil, private toastUtil: ToastUtil) {
  }

  ngOnInit() {
    const saved = localStorage.getItem(AcmeOrderDataTableComponent.DOMAIN_STORAGE_KEY);
    if (saved) {
      try {
        const domain = JSON.parse(saved);
        this.selectedDomain = domain;
        this.queryParam.acmeDomainId = domain.id;
        this.fetchData();
      } catch (e) {}
    }
  }

  fetchData() {
    if (!this.queryParam.acmeDomainId) {
      return;
    }
    const param: AcmeOrderPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.acmeService.queryAcmeOrderPage(param));
  }

  onSearchDomain = (term: string) => {
    const param: AcmeDomainPageQuery = {
      queryName: term,
      page: 1,
      length: 10,
    };
    return this.acmeService.queryAcmeDomainPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((domain, index) => ({ id: index, option: domain })),
        ),
      );
  };

  onDomainChange(domain: AcmeDomainVO) {
    this.queryParam.acmeDomainId = domain?.id;
    localStorage.setItem(AcmeOrderDataTableComponent.DOMAIN_STORAGE_KEY, JSON.stringify({ id: domain.id, name: domain.name, domain: domain.domain }));
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  formatJson(value: string): string {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch (e) {
      return value;
    }
  }

  onRowDelete(rowItem: AcmeOrderVO) {
    const dialogDate = {
      ...DIALOG_DATA.warningOperateData,
      content: '<strong>Confirm delete this order?</strong>',
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.acmeService.deleteAcmeOrderById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onViewCertificate(certificateId: number) {
    this.acmeService.getAcmeCertificate({ id: certificateId })
      .subscribe(({ body }) => {
        this.certificate = body;
      });
  }

  /**
   * 计算天数：from 为 null 时从当前时间算起
   */
  calcDays(from: any, to: any): number {
    const start = from ? new Date(from).getTime() : Date.now();
    const end = to ? new Date(to).getTime() : Date.now();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  }

  onDownloadCertificateById(certificateId: number) {
    this.acmeService.getAcmeCertificate({ id: certificateId })
      .subscribe(({ body }) => this.downloadCertificateZip(body));
  }

  onDownloadCertificate() {
    if (this.certificate) {
      this.downloadCertificateZip(this.certificate);
    }
  }

  private downloadCertificateZip(cert: any) {
    const zip = new JSZip();
    const domain = (cert.domains || 'certificate').replace(/[*]/g, '_wildcard').split(',')[0].trim();
    if (cert.certificate) {
      const fullPem = cert.certificateChain
        ? cert.certificate + '\n' + cert.certificateChain
        : cert.certificate;
      zip.file(`${domain}.pem`, fullPem);
    }
    if (cert.privateKey) {
      zip.file(`${domain}.key`, cert.privateKey);
    }
    zip.generateAsync({ type: 'blob' }).then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${domain}-cert.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

}
