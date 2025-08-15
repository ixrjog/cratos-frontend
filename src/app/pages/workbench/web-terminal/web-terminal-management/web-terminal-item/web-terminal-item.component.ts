import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { TerminalInstance } from '../web-terminal-management.component';

@Component({
  selector: 'app-web-terminal-item',
  templateUrl: './web-terminal-item.component.html',
  styleUrls: ['./web-terminal-item.component.less']
})
export class WebTerminalItemComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() terminal!: TerminalInstance;
  @Input() isSelected = false;
  @Input() isGroupControlMode = false;

  @Output() onSelect = new EventEmitter<{ instanceId: string, selected: boolean }>();
  @Output() onClose = new EventEmitter<string>();
  @Output() onCommand = new EventEmitter<{ instanceId: string, command: string }>();
  @Output() onResizeEvent = new EventEmitter<{ instanceId: string, width: number, height: number }>();
  @Output() onReady = new EventEmitter<{ instanceId: string, width: number, height: number }>();

  private destroy$ = new Subject<void>();
  private xterm!: Terminal;
  private fitAddon!: FitAddon;

  ngOnInit(): void {
    this.initTerminal();
    this.setupEventListeners();
  }

  ngAfterViewInit(): void {
    // 延迟初始化，确保DOM元素已经渲染
    setTimeout(() => {
      this.attachTerminal();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.xterm) {
      this.xterm.dispose();
    }
  }

  ngOnChanges(): void {
    // 移除群控模式变化时的终端写入，避免影响用户交互
    // 群控状态变化只通过UI提示，不写入终端
  }

  private initTerminal(): void {
    this.xterm = new Terminal({
      rows: 20, // 减少行数以适应两列布局
      cols: 60, // 减少列数以适应较小宽度
      fontFamily: '"Courier New", "DejaVu Sans Mono", "Liberation Mono", monospace',
      fontSize: 12, // 减小字体大小
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      allowTransparency: false,
      convertEol: true,
      disableStdin: false,
      macOptionIsMeta: true,
      rightClickSelectsWord: true,
      scrollOnUserInput: true,
      tabStopWidth: 8
    });

    this.fitAddon = new FitAddon();
    this.xterm.loadAddon(this.fitAddon);
    this.xterm.loadAddon(new WebLinksAddon());

    // 监听终端输入 - 直接通过xterm.js处理所有键盘输入
    this.xterm.onData((data) => {
      // 发送原始数据到后端
      this.onCommand.emit({
        instanceId: this.terminal.instanceId,
        command: data
      });
    });

    // 监听终端大小变化
    this.xterm.onResize((size) => {
      // 可以在这里通知后端终端大小变化
      console.log(`Terminal ${this.terminal.instanceId} resized to ${size.cols}x${size.rows}`);
    });
  }

  private attachTerminal(): void {
    const container = document.getElementById(`terminal-${this.terminal.instanceId}`);
    if (container && this.xterm) {
      try {
        this.xterm.open(container);
        this.fitAddon.fit();

        // 只在连接时显示简洁的欢迎信息
        this.xterm.writeln(`\x1b[32m正在连接到 ${this.terminal.assetName}...\x1b[0m`);
        this.xterm.writeln(`\x1b[36m实例ID: ${this.terminal.instanceId}\x1b[0m`);
        this.xterm.writeln('');

        // 设置焦点到终端
        this.xterm.focus();

        // 发送终端初始化完成事件，包含实际尺寸
        setTimeout(() => {
          const cols = this.xterm.cols;
          const rows = this.xterm.rows;
          this.onReady.emit({
            instanceId: this.terminal.instanceId,
            width: cols,
            height: rows
          });
          console.log(`Terminal ${this.terminal.instanceId} ready with dimensions: ${cols}x${rows}`);
        }, 50);
      } catch (error) {
        console.error('Failed to attach terminal:', error);
      }
    }
  }

  private setupEventListeners(): void {
    // 监听窗口大小变化
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.onResize();
      });

    // 监听终端输出事件
    fromEvent(window, 'terminalOutput')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event.detail && event.detail.instanceId === this.terminal.instanceId) {
          // 处理正常输出
          if (event.detail.output) {
            this.writeToTerminal(event.detail.output);
          }

          // 处理错误消息
          if (event.detail.errorMsg) {
            this.writeErrorToTerminal(event.detail.errorMsg);
          }
        }
      });
  }

  private writeToTerminal(output: string): void {
    if (this.xterm && output) {
      try {
        this.xterm.write(output);
      } catch (error) {
        console.error('Failed to write to terminal:', error);
      }
    }
  }

  private writeErrorToTerminal(errorMsg: string): void {
    if (this.xterm && errorMsg) {
      try {
        // 使用红色显示错误消息
        const formattedError = `\r\n\x1b[31m[ERROR] ${errorMsg}\x1b[0m\r\n`;
        this.xterm.write(formattedError);
        console.error('Terminal error:', errorMsg);
      } catch (error) {
        console.error('Failed to write error to terminal:', error);
      }
    }
  }

  onSelectionChange(selected: boolean): void {
    this.onSelect.emit({
      instanceId: this.terminal.instanceId,
      selected
    });

    // 移除选择变化时的终端写入，避免影响用户交互
    // 选择状态变化只通过UI提示，不写入终端
  }

  onCloseTerminal(): void {
    // 只在关闭时写入中断信息
    if (this.xterm) {
      this.xterm.writeln(`\r\n\x1b[31m正在关闭终端连接...\x1b[0m`);
    }
    this.onClose.emit(this.terminal.instanceId);
  }

  onResize(event?: Event): void {
    if (this.fitAddon && this.xterm) {
      try {
        setTimeout(() => {
          this.fitAddon.fit();
          
          // 获取调整后的终端尺寸
          const cols = this.xterm.cols;
          const rows = this.xterm.rows;
          
          // 发送RESIZE事件到父组件
          this.onResizeEvent.emit({
            instanceId: this.terminal.instanceId,
            width: cols,
            height: rows
          });
          
          console.log(`Terminal ${this.terminal.instanceId} resized to ${cols}x${rows}`);
        }, 100);
      } catch (error) {
        console.error('Failed to resize terminal:', error);
      }
    }
  }

}
