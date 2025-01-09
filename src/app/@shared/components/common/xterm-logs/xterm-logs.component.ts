import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit';
import { BASE_TERMINAL_OPTIONS } from '../../../constant/xterm.constant';

@Component({
  selector: 'app-xterm-logs',
  template: '<div class="app-xterm-logs" #terminal></div>',
  styleUrls: [ './xterm-logs.component.less' ],
})
export class XtermLogsComponent implements AfterViewInit, OnDestroy {

  feedLines = 1;
  @Input() logs: string = '';
  @Input() rows: number = 24;

  @ViewChild('terminal', { static: true })
  terminalWrapper: ElementRef;
  terminal: Terminal;
  fitAddon = new FitAddon();
  webLinksAddon = new WebLinksAddon();
  baseTerminalOptions: ITerminalOptions = BASE_TERMINAL_OPTIONS;

  constructor() {
    this.terminal = new Terminal(this.baseTerminalOptions);
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(this.webLinksAddon);
  }

  ngAfterViewInit(): void {
    this.terminal.open(this.terminalWrapper.nativeElement);
    window.dispatchEvent(new Event('resize'));
    this.fitAddon.fit();
    const defaultRows = this.rows;
    const defaultCols = this.terminal.cols;
    this.terminal.resize(defaultCols, Math.min(defaultRows, this.feedLines));
    this.terminal.onLineFeed(() => {
      this.feedLines++;
      this.terminal.resize(
        defaultCols,
        Math.min(defaultRows, this.feedLines),
      );
    });
    if (this.terminal && this.terminal.write) {
      this.terminal.write(this.logs);
    }
  }

  ngOnDestroy() {
    if (this.terminal) {
      this.terminal.dispose();
    }
  }

  onWrite(message: string) {
    this.terminal.write(message);
  }

}
