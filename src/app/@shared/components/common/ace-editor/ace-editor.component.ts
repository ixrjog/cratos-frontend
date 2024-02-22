import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: [ './ace-editor.component.less' ],
})
export class AceEditorComponent implements AfterViewInit {
  /**
   * @see <a href="https://ace.c9.io/#nav=howto">ace 文档</a>
   * @see <a href="https://jfcere.github.io/ngx-markdown/get-started">ngx-markdown 文档</a>
   */
  @ViewChild('editor') private editor: ElementRef<HTMLElement>;
  @Input() aceValue: string;
  @Input() readonly: boolean = false;
  @Input() minLines: number = 5;
  @Input() maxLines: number = 50 ;
  /**
   * @see <a href="https://github.com/ajaxorg/ace/tree/master/src/theme">theme 列表</a>
   */
  @Input() theme: string = 'ace/theme/chrome';
  /**
   * @see <a href="https://github.com/ajaxorg/ace/tree/master/src/mode">mode 列表</a>
   */
  @Input() mode: string = 'ace/mode/markdown';

  @Output() onChange = new EventEmitter<string>();

  ngAfterViewInit(): void {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
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
    aceEditor.setTheme(this.theme);
    aceEditor.session.setMode(this.mode);
    aceEditor.on('change', () => {
      this.onChange.emit(aceEditor.getValue())
    });
  }

}
