import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagService } from '../../../../../@core/services/tag.service';
import { TagEdit, TagVo } from '../../../../../@core/data/tag';

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: [ './tag-editor.component.less' ],
})
export class TagEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input()
  data: any;
  formData: TagVo;
  tagFormGroup: FormGroup;
  operationType: boolean;

  tagTypeOptions = [ 'SYS', 'CUSTOM' ];
  promptColorOptions = [
    'BLACK',
    'RED',
    'GREEN',
    'YELLOW',
    'BLUE',
    'MAGENTA',
    'CYAN',
    'WHITE',
    'BRIGHT',
  ];

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
  ) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.tagFormGroup = this.fb.group({
      id: [ this.formData.id ? this.formData.id : null, null ],
      tagType: [ this.formData.tagType, [ Validators.required ] ],
      tagKey: [ this.formData.tagKey, [ Validators.required ] ],
      tagValue: [ this.formData.tagValue, null ],
      color: [ this.formData.color, null ],
      promptColor: [ this.formData.promptColor, [ Validators.required ] ],
      seq: [ this.formData.seq, null ],
      valid: [ this.formData.valid, [ Validators.required ] ],
      comment: [ this.formData.comment, null ],
    });
  }

  addForm() {
    if (this.tagFormGroup.valid) {
      const param: TagEdit = {
        ...this.tagFormGroup.value,
      };
      return this.tagService.addTag(param);
    }
  }

  updateForm() {
    if (this.tagFormGroup.valid) {
      const param: TagEdit = {
        ...this.tagFormGroup.value,
      };
      return this.tagService.updateTag(param);
    }
  }

}
