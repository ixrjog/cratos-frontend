import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @Input() minLines: number = 5;
  @Input() maxLines: number = 50 ;
  @Output() onChange = new EventEmitter<string>();

  ngAfterViewInit(): void {
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
    );
    let fontSize: string;
    switch (localStorage.getItem('font')) {
      case 'normal':
        fontSize = '12px';
        break;
      case 'medium':
        fontSize = '14px';
        break;
      case 'large':
        fontSize = '16px';
        break;
      default:
        fontSize = '12px';
        break;
    }
    ace.config.set('fontSize', fontSize);
    ace.config.set('minLines', this.minLines);
    ace.config.set('maxLines', this.maxLines);
    const aceEditor = ace.edit(this.editor.nativeElement);
    aceEditor.setReadOnly(this.readonly);
    aceEditor.session.setValue(this.aceValue);
    aceEditor.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/markdown');
    aceEditor.on('change', () => {
      this.onChange.emit(aceEditor.getValue())
    });
  }

}
