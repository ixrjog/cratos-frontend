import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  AddCratosAsset,
  EdsAssetFieldDesc,
  EdsSupportManualAssetVO,
} from '../../../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';

@Component({
  selector: 'app-eds-asset-manual-editor',
  templateUrl: './eds-asset-manual-editor.component.html',
  styleUrls: [ './eds-asset-manual-editor.component.less' ],
})
export class EdsAssetManualEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: AddCratosAsset;
  supportManualAsset: EdsSupportManualAssetVO;
  operationType: boolean;

  constructor(private edsService: EdsService) {
  }

  onConvertFieldDesc(field: string) {
    const edsAssetFieldDesc: EdsAssetFieldDesc = this.supportManualAsset.mapper['fields'][field];
    if (edsAssetFieldDesc !== undefined) {
      return edsAssetFieldDesc.desc;
    }
    let fieldDesc = field.replace(/([A-Z])/g, ' $1');
    return fieldDesc.charAt(0).toUpperCase() + fieldDesc.slice(1);
  }

  onConvertFieldRequired(field: string) {
    const edsAssetFieldDesc: EdsAssetFieldDesc = this.supportManualAsset.mapper['fields'][field];
    if (edsAssetFieldDesc !== undefined) {
      return edsAssetFieldDesc.required;
    }
    return false;
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.supportManualAsset = this.data['supportManualAsset'];
  }

  addForm() {
    const param: AddCratosAsset = {
      ...this.formData,
    };
    return this.edsService.addInstanceCratosAsset(param);
  }

}
