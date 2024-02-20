import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: [ './ace-editor.component.less' ],
})
export class AceEditorComponent implements AfterViewInit {

  @ViewChild('editor') private editor: ElementRef<HTMLElement>;
  @Input() aceValue: string;

  @Input() readonly: boolean = false;

  ngAfterViewInit(): void {
    let fontSize: string;
    switch (localStorage.getItem('font')) {
      case 'normal':
        fontSize = '12px';
        break;
      case 'medium':
        fontSize = '14px';
        break;
      case 'large':
        fontSize = '14px';
        break;
      default:
        fontSize = '12px';
        break;
    }
    ace.config.set('fontSize', fontSize);
    const aceEditor = ace.edit(this.editor.nativeElement);
    aceEditor.setReadOnly(this.readonly);
    aceEditor.session.setValue(this.aceValue);
    aceEditor.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/html');
    aceEditor.on('change', () => {
      this.aceValue = aceEditor.getValue();
    });
  }

}
