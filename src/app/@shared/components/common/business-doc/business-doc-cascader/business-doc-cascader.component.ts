import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagService } from '../../../../../@core/services/tag.service';
import { BusinessTagService } from '../../../../../@core/services/business-tag.service';

interface QueryByTag {
  tagId: number,
  tagValue: string
}

@Component({
  selector: 'app-business-doc-cascader',
  templateUrl: './business-doc-cascader.component.html',
  styleUrls: [ './business-doc-cascader.component.less' ],
})
export class BusinessDocCascaderComponent implements OnInit {

  constructor(private tagService: TagService,
              private businessTagService: BusinessTagService) {
  }

  ngOnInit(): void {
    this.getTagOptions();
  }

  tagOptions = [];
  tags = [];
  tagOptionsLength: number = null;

  @Input() businessType: string;
  @Output() onChange = new EventEmitter<QueryByTag>();

  getTagOptions() {
    this.tagService.queryTagByBusinessType({ businessType: this.businessType })
      .subscribe(({ body }) => {
        this.tagOptionsLength = body.length
        body.map(tag => {
          this.businessTagService.queryBusinessTagByValue({ tagId: tag.id })
            .subscribe(({ body }) => {
              let child = [];
              body.map(value => {
                child.push({
                  label: tag.tagKey + ': ' + value,
                  value: value,
                });
              });
              this.tagOptions.push({
                label: tag.tagKey,
                value: tag.id,
                children: child,
              });
            });
        });
      });
  }

  onChanges(value: any) {
    let queryByTag: QueryByTag = {
      tagId: null,
      tagValue: null,
    };
    if (value[0]) {
      queryByTag.tagId = value[0];
    }
    if (value[1]) {
      queryByTag.tagValue = value[1];
    }
    this.onChange.emit(queryByTag);
  }
}
