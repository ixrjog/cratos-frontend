import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { CommandExecVO } from '../../../../../@core/data/command';

@Component({
  selector: 'app-command-exec-view',
  templateUrl: './command-exec-view.component.html',
  styleUrls: [ './command-exec-view.component.less' ],
})
export class CommandExecViewComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: CommandExecVO;

  constructor() {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

}
