import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { TranslateService } from '@ngx-translate/core';
import { TerminalInstance } from '../web-terminal-management.component';
import { TerminalThemeService } from '../terminal-theme.service';
import { TerminalTheme } from '../terminal-themes.config';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { DialogUtil } from '../../../../../@shared/utils/dialog.util';

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
  @Output() onWideScreenToggle = new EventEmitter<{ instanceId: string, isWideScreen: boolean }>();

  // 宽屏模式状态
  isWideScreen = false;

  // 保存原始终端尺寸
  private originalRows: number = 25;
  private originalCols: number = 80;

  private destroy$ = new Subject<void>();
  private xterm!: Terminal;
  private fitAddon!: FitAddon;

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private dialogUtil: DialogUtil,
    private themeService: TerminalThemeService
  ) {}

  ngOnInit(): void {
    this.initTerminal();
    this.setupEventListeners();
    this.subscribeToThemeChanges();
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
    // 获取当前主题
    const currentTheme = this.themeService.getCurrentTheme();

    this.xterm = new Terminal({
      rows: 25, // 增加行数以显示更多内容
      cols: 60, // 减少列数以适应较小宽度
      fontFamily: '"Courier New", "DejaVu Sans Mono", "Liberation Mono", monospace',
      fontSize: 12, // 保持原始字体大小
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
      tabStopWidth: 8,
      theme: {
        foreground: currentTheme.colors.foreground,
        background: currentTheme.colors.background,
        cursor: currentTheme.colors.cursor,
        black: currentTheme.colors.black,
        red: currentTheme.colors.red,
        green: currentTheme.colors.green,
        yellow: currentTheme.colors.yellow,
        blue: currentTheme.colors.blue,
        magenta: currentTheme.colors.magenta,
        cyan: currentTheme.colors.cyan,
        white: currentTheme.colors.white,
        brightBlack: currentTheme.colors.brightBlack,
        brightRed: currentTheme.colors.brightRed,
        brightGreen: currentTheme.colors.brightGreen,
        brightYellow: currentTheme.colors.brightYellow,
        brightBlue: currentTheme.colors.brightBlue,
        brightMagenta: currentTheme.colors.brightMagenta,
        brightCyan: currentTheme.colors.brightCyan,
        brightWhite: currentTheme.colors.brightWhite
      }
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
      // 终端大小变化时的处理
    });
  }

  private subscribeToThemeChanges(): void {
    this.themeService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.applyTheme(theme);
      });
  }

  private applyTheme(theme: TerminalTheme): void {
    if (!this.xterm) return;

    // 更新终端主题 - 只更新颜色，不改变字体设置
    this.xterm.options.theme = {
      foreground: theme.colors.foreground,
      background: theme.colors.background,
      cursor: theme.colors.cursor,
      black: theme.colors.black,
      red: theme.colors.red,
      green: theme.colors.green,
      yellow: theme.colors.yellow,
      blue: theme.colors.blue,
      magenta: theme.colors.magenta,
      cyan: theme.colors.cyan,
      white: theme.colors.white,
      brightBlack: theme.colors.brightBlack,
      brightRed: theme.colors.brightRed,
      brightGreen: theme.colors.brightGreen,
      brightYellow: theme.colors.brightYellow,
      brightBlue: theme.colors.brightBlue,
      brightMagenta: theme.colors.brightMagenta,
      brightCyan: theme.colors.brightCyan,
      brightWhite: theme.colors.brightWhite
    };

    // 刷新终端显示
    this.xterm.refresh(0, this.xterm.rows - 1);
  }

  private attachTerminal(): void {
    const container = document.getElementById(`terminal-${this.terminal.instanceId}`);
    if (container && this.xterm) {
      try {
        this.xterm.open(container);
        this.fitAddon.fit();

        // 保存初始尺寸作为原始尺寸
        this.originalRows = this.xterm.rows;
        this.originalCols = this.xterm.cols;

        // 使用 i18n 显示连接信息
        const connectingMsg = this.translate.instant('webTerminal.connectingTo');
        const instanceIdLabel = this.translate.instant('webTerminal.instanceId');

        this.xterm.writeln(`\x1b[32m${connectingMsg} ${this.terminal.assetName}...\x1b[0m`);
        this.xterm.writeln(`\x1b[36m${instanceIdLabel}: ${this.terminal.instanceId}\x1b[0m`);
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
    // 使用 i18n 显示关闭信息
    if (this.xterm) {
      const closingMsg = this.translate.instant('webTerminal.closingConnection');
      this.xterm.writeln(`\r\n\x1b[31m${closingMsg}\x1b[0m`);
    }
    this.onClose.emit(this.terminal.instanceId);
  }

  // 切换宽屏模式
  toggleWideScreen(): void {
    this.isWideScreen = !this.isWideScreen;

    // 手动触发变更检测
    this.cdr.detectChanges();

    // 通知父组件宽屏模式变化
    this.onWideScreenToggle.emit({
      instanceId: this.terminal.instanceId,
      isWideScreen: this.isWideScreen
    });

    // 如果退出宽屏模式，进行温和的重置
    if (!this.isWideScreen) {
      setTimeout(() => {
        this.forceResetTerminalHeight();
      }, 50);
    }

    // 延迟调整终端尺寸以适应新的布局
    setTimeout(() => {
      this.onResize();
    }, this.isWideScreen ? 200 : 400); // 退出宽屏模式时给更多时间
  }

  // 强制重置终端高度
  private forceResetTerminalHeight(): void {
    const element = document.querySelector(`[data-terminal-id="${this.terminal.instanceId}"]`) as HTMLElement;
    if (!element) return;

    // 移除宽屏类
    element.classList.remove('wide-screen');

    // 清除可能的内联样式
    element.style.minHeight = '';
    element.style.maxHeight = '';
    element.style.height = '';
    element.style.gridColumn = '';
    element.style.gridRow = '';

    // 强制应用正常模式样式
    element.classList.add('force-reset');

    // 触发重排
    element.offsetHeight;

    // 短暂延迟后移除强制重置类
    setTimeout(() => {
      element.classList.remove('force-reset');

      // 强制恢复到原始行数
      setTimeout(() => {
        this.restoreOriginalSize();
      }, 100);
    }, 100);
  }

  // 恢复原始尺寸
  private restoreOriginalSize(): void {
    if (this.fitAddon && this.xterm) {
      try {
        // 先进行正常的fit
        this.fitAddon.fit();

        const currentRows = this.xterm.rows;
        const currentCols = this.xterm.cols;

        // 如果行数不匹配，尝试手动调整
        if (currentRows !== this.originalRows) {
          // 手动设置终端尺寸
          this.xterm.resize(this.originalCols, this.originalRows);

          // 更新终端实例的尺寸信息
          this.terminal.cols = this.originalCols;
          this.terminal.rows = this.originalRows;

          // 发送RESIZE事件到父组件
          this.onResizeEvent.emit({
            instanceId: this.terminal.instanceId,
            width: this.originalCols,
            height: this.originalRows
          });
        }
      } catch (error) {
        console.error('Failed to restore original size:', error);
      }
    }
  }

  onResize(event?: Event): void {
    if (this.fitAddon && this.xterm) {
      try {
        setTimeout(() => {
          // 如果不是宽屏模式，且我们有原始尺寸，尝试保持原始行数
          if (!this.isWideScreen && this.originalRows > 0) {
            // 先进行fit以获取最佳列数
            this.fitAddon.fit();
            const newCols = this.xterm.cols;

            // 但保持原始行数
            if (this.xterm.rows !== this.originalRows) {
              this.xterm.resize(newCols, this.originalRows);
            }

            // 使用实际的尺寸
            const cols = this.xterm.cols;
            const rows = this.xterm.rows;

            // 发送RESIZE事件到父组件
            this.onResizeEvent.emit({
              instanceId: this.terminal.instanceId,
              width: cols,
              height: rows
            });

            // 更新终端实例的尺寸信息
            this.terminal.cols = cols;
            this.terminal.rows = rows;
          } else {
            // 宽屏模式或没有原始尺寸时，正常处理
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

            // 更新终端实例的尺寸信息
            this.terminal.cols = cols;
            this.terminal.rows = rows;
          }
        }, 100);
      } catch (error) {
        console.error('Failed to resize terminal:', error);
      }
    }
  }

  onRowBusinessDoc() {
    this.dialogUtil.onBusinessDocsEditDialog(BusinessTypeEnum.EDS_ASSET, this.terminal.asset, () => null);
  }

}
