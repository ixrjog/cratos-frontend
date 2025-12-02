import { Component } from '@angular/core';
import { CertificateService } from '../../../../@core/services/certificate.service';
import { map } from 'rxjs/operators';
import { CertificateDeploymentVO, CertificateVO } from '../../../../@core/data/certificate';
import { finalize } from 'rxjs';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-certificate-deployment-detail',
  templateUrl: './certificate-deployment-detail.component.html',
  styleUrls: [ './certificate-deployment-detail.component.less' ],
})
export class CertificateDeploymentDetailComponent {

  queryParam = {
    queryName: '',
  };
  certificateName: string = '';
  loading: boolean = false;

  detailList: Array<CertificateDeploymentVO> = [];

  constructor(private certificateService: CertificateService) {
  }

  onSearchCertificateName = (term: string) => {
    return this.certificateService.getCertificateNameOptions({ queryName: term })
      .pipe(
        map(({ body }) =>
          body.map((name, index) => ({ id: index, option: name })),
        ),
      );
  };

  onCertificateNameChange(option: any) {
    if (this.certificateName !== '') {
      this.fetchData();
    }
  }

  fetchData() {
    this.loading = true;
    this.certificateService.getCertificateDeploymentDetails({ name: this.certificateName })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(({ body }) => {
        this.detailList = body;
      });
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  onRowValid(rowItem: CertificateVO) {
    this.certificateService.setCertificateValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }
}
