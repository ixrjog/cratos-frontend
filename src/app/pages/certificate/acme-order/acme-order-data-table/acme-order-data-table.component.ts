import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AcmeDomainGroupVO, AcmeOrderPageQuery, AcmeOrderVO, AcmeService } from '../../../../@core/services/acme.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
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
  private static readonly DOMAINS_STORAGE_KEY = 'acme_order_selected_domains';

  readonly ALL_DOMAIN = '__ALL__';

  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  protected readonly limit = RELATIVE_TIME_LIMIT;

  /** Distinct `domain` values with their member counts, used to render tabs. */
  domainTabs: AcmeDomainGroupVO[] = [];
  /** Currently selected domain tab (ALL_DOMAIN means "show all"). */
  activeDomain: string = this.ALL_DOMAIN;

  /** Distinct order `domains` values (scoped by the active domain tab), used by the dropdown. */
  domainsOptions: { label: string; value: string }[] = [];
  /** Currently selected `domains` filter (null means "no filter"). */
  selectedDomains: string = null;

  table: Table<AcmeOrderVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  certificate: any = null;
  showPrivateKey: boolean = false;

  constructor(private acmeService: AcmeService, private dialogUtil: DialogUtil, private toastUtil: ToastUtil) {
  }

  ngOnInit() {
    const savedDomain = localStorage.getItem(AcmeOrderDataTableComponent.DOMAIN_STORAGE_KEY);
    // Guard against the legacy format where this key stored a JSON object.
    if (savedDomain && !savedDomain.startsWith('{')) {
      this.activeDomain = savedDomain;
    } else if (savedDomain) {
      localStorage.removeItem(AcmeOrderDataTableComponent.DOMAIN_STORAGE_KEY);
    }
    const savedDomains = localStorage.getItem(AcmeOrderDataTableComponent.DOMAINS_STORAGE_KEY);
    if (savedDomains) {
      this.selectedDomains = savedDomains;
    }
    this.fetchDomainTabs();
    this.fetchDomainsOptions();
    this.fetchData();
  }

  fetchData() {
    const param: AcmeOrderPageQuery = {
      domain: this.activeDomain === this.ALL_DOMAIN ? undefined : this.activeDomain,
      domains: this.selectedDomains || undefined,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.acmeService.queryAcmeOrderPage(param));
  }

  /** Load the distinct domain tabs (with member counts) from the backend. */
  private fetchDomainTabs() {
    this.acmeService.queryDistinctAcmeDomain().subscribe(({ body }) => {
      this.domainTabs = body || [];
      // Reset the active tab if the selected domain no longer exists.
      if (this.activeDomain !== this.ALL_DOMAIN && !this.domainTabs.some(t => t.domain === this.activeDomain)) {
        this.activeDomain = this.ALL_DOMAIN;
      }
    });
  }

  /** Load the distinct order `domains` options, scoped by the active domain tab. */
  private fetchDomainsOptions() {
    const domain = this.activeDomain === this.ALL_DOMAIN ? undefined : this.activeDomain;
    this.acmeService.queryDistinctOrderDomains(domain).subscribe(({ body }) => {
      const values = body || [];
      this.domainsOptions = values.map(v => ({ label: v, value: v }));
      // Clear the selection if it no longer exists within the current scope.
      if (this.selectedDomains && !values.includes(this.selectedDomains)) {
        this.selectedDomains = null;
        localStorage.removeItem(AcmeOrderDataTableComponent.DOMAINS_STORAGE_KEY);
      }
    });
  }

  onDomainTabChange(domain: string) {
    this.activeDomain = domain;
    localStorage.setItem(AcmeOrderDataTableComponent.DOMAIN_STORAGE_KEY, domain);
    // Reset the domains filter when switching apex domain.
    this.selectedDomains = null;
    localStorage.removeItem(AcmeOrderDataTableComponent.DOMAINS_STORAGE_KEY);
    this.table.pager.pageIndex = 1;
    this.fetchDomainsOptions();
    this.fetchData();
  }

  onDomainsChange(domains: any) {
    const value = typeof domains === 'object' ? domains?.value || null : domains || null;
    this.selectedDomains = value;
    if (this.selectedDomains) {
      localStorage.setItem(AcmeOrderDataTableComponent.DOMAINS_STORAGE_KEY, this.selectedDomains);
    } else {
      localStorage.removeItem(AcmeOrderDataTableComponent.DOMAINS_STORAGE_KEY);
    }
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
    this.showPrivateKey = false;
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
