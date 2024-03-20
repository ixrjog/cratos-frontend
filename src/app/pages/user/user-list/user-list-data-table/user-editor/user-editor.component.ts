import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../@core/data/user';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.less']
})
export class UserEditorComponent implements OnInit {

  tabActiveId: string | number = 'info';

  @Input() data: any;
  formData: UserVO;
  operationType: boolean;
  fromAssetId: number;

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.operationType = this.data['operationType'];
    this.fromAssetId = this.data['fromAssetId'];
    if (this.data['tabActiveId']) {
      this.tabActiveId = this.data['tabActiveId'];
    }
  }

  onUserAdded(user: UserVO) {
    this.formData = user;
  }

}
