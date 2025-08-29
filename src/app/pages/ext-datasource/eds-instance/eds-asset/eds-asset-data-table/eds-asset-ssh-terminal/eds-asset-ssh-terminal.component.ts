import { Component, Input, OnInit } from '@angular/core';
import { EdsAssetVO } from '../../../../../../@core/data/ext-datasource';

@Component({
  selector: 'app-eds-asset-ssh-terminal',
  templateUrl: './eds-asset-ssh-terminal.component.html',
  styleUrls: [ './eds-asset-ssh-terminal.component.less' ],
})
export class EdsAssetSshTerminalComponent implements OnInit {
  @Input() data: any;
  formData: EdsAssetVO;

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }


}
