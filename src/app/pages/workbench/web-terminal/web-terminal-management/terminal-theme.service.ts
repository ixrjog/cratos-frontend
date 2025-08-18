import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TerminalTheme, TERMINAL_THEMES, DEFAULT_THEME_ID } from './terminal-themes.config';

@Injectable({
  providedIn: 'root'
})
export class TerminalThemeService {
  private readonly STORAGE_KEY = 'terminal_theme_settings';
  
  private currentThemeSubject = new BehaviorSubject<TerminalTheme>(this.getDefaultTheme());
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.loadThemeSettings();
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): TerminalTheme {
    return this.currentThemeSubject.value;
  }

  /**
   * 设置当前主题
   */
  setCurrentTheme(themeId: string): void {
    const theme = this.findThemeById(themeId);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.saveThemeSettings();
    }
  }

  /**
   * 重置为默认主题
   */
  resetToDefault(): void {
    this.setCurrentTheme(DEFAULT_THEME_ID);
  }

  private findThemeById(themeId: string): TerminalTheme | undefined {
    return TERMINAL_THEMES.find(theme => theme.id === themeId);
  }

  private getDefaultTheme(): TerminalTheme {
    return TERMINAL_THEMES.find(theme => theme.id === DEFAULT_THEME_ID) || TERMINAL_THEMES[0];
  }

  private loadThemeSettings(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        const theme = this.findThemeById(settings.currentThemeId);
        if (theme) {
          this.currentThemeSubject.next(theme);
        }
      }
    } catch (error) {
      console.warn('Failed to load theme settings:', error);
    }
  }

  private saveThemeSettings(): void {
    try {
      const currentTheme = this.getCurrentTheme();
      const settings = {
        currentThemeId: currentTheme.id,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save theme settings:', error);
    }
  }
}
