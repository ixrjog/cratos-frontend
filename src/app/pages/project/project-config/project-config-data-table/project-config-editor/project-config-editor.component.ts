import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ProjectService } from '../../../../../@core/services/project.service';

@Component({
  selector: 'app-project-config-editor',
  templateUrl: './project-config-editor.component.html',
  styleUrls: ['./project-config-editor.component.less'],
})
export class ProjectConfigEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      key: new UntypedFormControl(this.formData.key),
      name: new UntypedFormControl(this.formData.name),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
    });
  }

  addForm() {
    return this.projectService.addProject(this.formGroup.value);
  }

  updateForm() {
    return this.projectService.updateProject({ ...this.formGroup.value, id: this.formData.id });
  }
}
