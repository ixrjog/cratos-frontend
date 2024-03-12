import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules, SplitterOrientation } from 'ng-devui';
import { EdsConfigEdit, EdsConfigVO } from '../../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { map } from 'rxjs/operators';
import { CredentialPageQuery, CredentialVO } from '../../../../../@core/data/credential';
import { CredentialService } from '../../../../../@core/services/credential.service';

@Component({
  selector: 'app-eds-config-editor',
  templateUrl: './eds-config-editor.component.html',
  styleUrls: ['./eds-config-editor.component.less']
})
export class EdsConfigEditorComponent implements OnInit {

  size = '30%';
  minSize = '20%';
  maxSize = '60%';
  orientation: SplitterOrientation = 'horizontal';
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: EdsConfigVO;
  edsTypeOptions = [];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private edsService: EdsService,
              private credentialService: CredentialService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.getEdsTypeOptions();
  }

  getEdsTypeOptions() {
    this.edsService.getEdsInstanceTypeOptions()
      .subscribe(({ body }) => {
        this.edsTypeOptions = body.options;
      });
  };

  onSearchCredential = (term: string) => {
    const param: CredentialPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.credentialService.queryCredentialPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((credential, index) => ({ id: index, option: credential })),
        ),
      );
  };

  onCredentialChange(credential: CredentialVO) {
    this.formData.credentialId = credential.id;
  }

  onContentChange(content: string, edsConfigVO: EdsConfigVO) {
    edsConfigVO.configContent = content;
  }

  addForm() {
    const param: EdsConfigEdit = {
      ...this.formData,
    };
    return this.edsService.addEdsConfig(param);
  }

  updateForm() {
    const param: EdsConfigEdit = {
      ...this.formData,
    };
    return this.edsService.updateEdsConfig(param);
  }

  protected readonly JSON = JSON;
}
