import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DatacenterService } from '../../../../../@core/services/datacenter.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-datacenter-allocation-editor',
  templateUrl: './datacenter-allocation-editor.component.html',
  styleUrls: ['./datacenter-allocation-editor.component.less'],
})
export class DatacenterAllocationEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;
  selectedNetwork: any;

  allocationTypeOptions = ['SUBNET', 'VPC', 'VLAN', 'RESERVED'];
  cidrCheckResult: any = null;

  constructor(private datacenterService: DatacenterService) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      networkId: new UntypedFormControl(this.formData.networkId),
      name: new UntypedFormControl(this.formData.name),
      region: new UntypedFormControl(this.formData.region),
      cidr: new UntypedFormControl(this.formData.cidr),
      nat: new UntypedFormControl(this.formData.nat),
      allocationType: new UntypedFormControl(this.formData.allocationType),
      allowOverlap: new UntypedFormControl(this.formData.allowOverlap),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
    });
    // 编辑时或从首页传入 selectedNetwork
    if (this.data['selectedNetwork']) {
      this.selectedNetwork = this.data['selectedNetwork'];
    }
  }

  onSearchNetwork = (term: string) => {
    return this.datacenterService.queryNetworkPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) =>
          body.data.map((network, index) => ({ id: index, option: network })),
        ),
      );
  };

  onNetworkChange(network: any) {
    this.formGroup.patchValue({ networkId: network?.id || null });
  }

  onCheckCidr() {
    const cidr = this.formGroup.get('cidr').value;
    if (!cidr) {
      return;
    }
    this.cidrCheckResult = null;
    this.datacenterService.checkCidrConflict({
      cidr: cidr,
      excludeId: this.formData.id || null,
    }).subscribe(({ body }) => {
      this.cidrCheckResult = body;
    });
  }

  addForm() {
    return this.datacenterService.addAllocation(this.formGroup.value);
  }

  updateForm() {
    return this.datacenterService.updateAllocation({ ...this.formGroup.value, id: this.formData.id });
  }

}
