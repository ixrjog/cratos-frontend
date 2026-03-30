import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AcmeService } from '../../../../../@core/services/acme.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-acme-domain-editor',
  templateUrl: './acme-domain-editor.component.html',
  styleUrls: ['./acme-domain-editor.component.less'],
})
export class AcmeDomainEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;
  dcvTypeOptions = ['CLOUDFLARE'];

  onSearchAccount = (term: string) => {
    return this.acmeService.queryAcmeAccountPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) =>
          body.data.map((account, index) => ({ id: index, option: account })),
        ),
      );
  };

  onAccountChange(account: any) {
    this.formGroup.patchValue({ accountId: account?.id });
  }

  constructor(private acmeService: AcmeService) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl(this.formData.name),
      domain: new UntypedFormControl(this.formData.domain),
      domains: new UntypedFormControl(this.formData.domains),
      zoneId: new UntypedFormControl(this.formData.zoneId),
      dnsResolverInstanceId: new UntypedFormControl(this.formData.dnsResolverInstanceId),
      accountId: new UntypedFormControl(this.formData.accountId),
      dcvType: new UntypedFormControl(this.formData.dcvType),
      dcvDelegationTarget: new UntypedFormControl(this.formData.dcvDelegationTarget),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
    });
  }

  addForm() {
    return this.acmeService.addAcmeDomain(this.formGroup.value);
  }

  updateForm() {
    return this.acmeService.addAcmeDomain({ ...this.formGroup.value, id: this.formData.id });
  }

}
