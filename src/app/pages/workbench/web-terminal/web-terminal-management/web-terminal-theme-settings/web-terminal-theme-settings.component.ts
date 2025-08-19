import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TerminalTheme, TERMINAL_THEMES } from '../terminal-themes.config';
import { TerminalThemeService } from '../terminal-theme.service';

@Component({
  selector: 'app-web-terminal-theme-settings',
  templateUrl: './web-terminal-theme-settings.component.html',
  styleUrls: ['./web-terminal-theme-settings.component.less']
})
export class WebTerminalThemeSettingsComponent implements OnInit, OnDestroy {
  @Output() onClose = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  // 主题相关
  presetThemes: TerminalTheme[] = TERMINAL_THEMES;
  currentTheme: TerminalTheme | null = null;
  selectedThemeId = '';

  // 预览相关
  previewText = `$ echo "Hello Terminal Theme!"
Hello Terminal Theme!
$ ls -la
total 64
drwxr-xr-x  8 user  staff   256 Aug 18 15:30 .
-rw-r--r--  1 user  staff  1024 Aug 18 15:30 README.md
$ npm start
> Starting development server...
✓ Server running on http://localhost:3000`;

  constructor(
    private themeService: TerminalThemeService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadCurrentTheme();
    this.subscribeToThemeChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentTheme(): void {
    try {
      this.currentTheme = this.themeService.getCurrentTheme();
      if (this.currentTheme) {
        this.selectedThemeId = this.currentTheme.id;
      }
    } catch (error) {
      console.error('Error loading current theme:', error);
      // 使用默认主题
      this.currentTheme = this.presetThemes[0];
      this.selectedThemeId = this.currentTheme.id;
    }
  }

  private subscribeToThemeChanges(): void {
    try {
      this.themeService.currentTheme$
        .pipe(takeUntil(this.destroy$))
        .subscribe(theme => {
          this.currentTheme = theme;
          this.selectedThemeId = theme.id;
        });
    } catch (error) {
      console.error('Error subscribing to theme changes:', error);
    }
  }

  // 主题选择
  onThemeSelect(themeId: string): void {
    try {
      this.themeService.setCurrentTheme(themeId);
    } catch (error) {
      console.error('Error selecting theme:', error);
    }
  }

  // 重置
  onResetToDefault(): void {
    const confirmMessage = this.translate.instant('webTerminal.themeSettings.resetConfirmation');
    if (confirm(confirmMessage)) {
      try {
        this.themeService.resetToDefault();
      } catch (error) {
        console.error('Error resetting to default theme:', error);
      }
    }
  }

  // 获取预览样式
  getPreviewStyle(): any {
    if (!this.currentTheme) return {};
    
    try {
      return {
        'background-color': this.currentTheme.colors.background,
        'color': this.currentTheme.colors.foreground,
        'font-family': this.currentTheme.fontFamily || 'monospace',
        'font-size': `${this.currentTheme.fontSize || 14}px`,
        'line-height': this.currentTheme.lineHeight || 1.2,
        'letter-spacing': `${this.currentTheme.letterSpacing || 0}px`
      };
    } catch (error) {
      console.error('Error getting preview style:', error);
      return {};
    }
  }

  // 关闭设置面板
  close(): void {
    this.onClose.emit();
  }
}
