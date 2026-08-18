import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import { isDark } from '../../../utils/theme.util';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: [ './ace-editor.component.less' ],
})
export class AceEditorComponent implements AfterViewInit {
  /**
   * @see <a href="https://ace.c9.io/#nav=howto">ace 文档</a>
   * @see <a href="https://github.com/ajaxorg/ace/wiki/Configuring-Ace">ace config</a>
   * @see <a href="https://jfcere.github.io/ngx-markdown/get-started">ngx-markdown 文档</a>
   */
  @ViewChild('editor') private editor: ElementRef<HTMLElement>;
  @Input() aceValue: string;
  @Input() readonly: boolean = false;
  @Input() minLines: number = 5;
  @Input() maxLines: number = 50 ;
  @Input() showLineNumbers: boolean = true;
  /**
   * 是否启用语法校验 worker。
   * 对于服务端 SnakeYAML 序列化内容(含 !!java 全局标签，如 !!com.baiyi...$Config)，
   * 前端 js-yaml 校验会误报 "unknown tag"，此时应关闭 worker(仅保留高亮)。
   */
  @Input() useWorker: boolean = true;
  /**
   * @see <a href="https://github.com/ajaxorg/ace/tree/master/src/theme">theme 列表</a>
   */
  // ace/theme/tomorrow_night
  // @Input() theme: string = 'ace/theme/tomorrow';
  /**
   * @see <a href="https://github.com/ajaxorg/ace/tree/master/src/mode">mode 列表</a>
   */
  @Input() mode: string = 'ace/mode/markdown';

  options = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
  };

  @Output() onChange = new EventEmitter<string>();

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
        fontSize = '16px';
        break;
      default:
        fontSize = '12px';
        break;
    }
    ace.config.set('fontSize', fontSize);
    ace.config.set('minLines', this.minLines);
    ace.config.set('maxLines', this.maxLines);
    ace.config.set('showLineNumbers', this.showLineNumbers);
    const aceEditor = ace.edit(this.editor.nativeElement);
    ace.require('ace/ext/language_tools');
    aceEditor.setOptions(this.options);
    aceEditor.setReadOnly(this.readonly);
    aceEditor.session.setValue(this.aceValue);
    aceEditor.session.setMode(this.mode);
    // YAML 内容多为服务端 SnakeYAML 序列化(含 !!java 全局标签)，其 worker 会误报 "unknown tag"，
    // 故对 yaml 模式全局关闭校验 worker(仅保留高亮)；其余模式沿用 useWorker 配置。
    const enableWorker = this.useWorker && this.mode !== 'ace/mode/yaml';
    aceEditor.session.setUseWorker(enableWorker);
    if (isDark()) {
      aceEditor.setTheme('ace/theme/tomorrow_night');
    } else {
      aceEditor.setTheme('ace/theme/tomorrow');
    }
    aceEditor.on('change', () => {
      this.onChange.emit(aceEditor.getValue())
    });
  }

  onWrite(value: string) {
    const aceEditor = ace.edit(this.editor.nativeElement);
    aceEditor.session.setValue(value);
  }

}
