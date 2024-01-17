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
  data: TagVo;
  tagFormGroup: FormGroup;

  tagTypeOptions = [
    { tagType: 0, desc: 'SYS' },
    { tagType: 1, desc: 'CUSTOM' },
  ];

  promptColorOptions = [
    { value: 0, label: 'BLACK' },
    { value: 1, label: 'RED' },
    { value: 2, label: 'GREEN' },
    { value: 3, label: 'YELLOW' },
    { value: 4, label: 'BLUE' },
    { value: 5, label: 'MAGENTA' },
    { value: 6, label: 'CYAN' },
    { value: 7, label: 'WHITE' },
    { value: 8, label: 'BRIGHT' },
  ];

  constructor(private fb: FormBuilder,
              private tagService: TagService) {
  }

  ngOnInit(): void {
    this.tagFormGroup = this.fb.group({
      id: [ this.data.id ? this.data.id : null, null ],
      tagType: [ this.data.tagType, [ Validators.required ] ],
      tagKey: [ this.data.tagKey, [ Validators.required ] ],
      tagValue: [ this.data.tagValue, [ Validators.required ] ],
      color: [ this.data.color, null ],
      promptColor: [ this.data.promptColor, [ Validators.required ] ],
      seq: [ this.data.seq, null ],
      valid: [ this.data.valid, [ Validators.required ] ],
      comment: [ this.data.comment, null ],
    });
  }

  submitForm() {
    // const param: TagEdit = {
    //   ...this.tagFormGroup
    // }
    // if (param)
    // this.tagService.updateTag(this.)
    console.log(1231213);
  }
  onChangeTest(val){
    console.log(val);
  }
}
