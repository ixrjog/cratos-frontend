import { DARK_THEME_POPOVER_STYLE, LIGHT_THEME_POPOVER_STYLE } from '../constant/theme.constant';

export function isDark(): boolean {
  const theme = localStorage.getItem('theme');

  if (theme === 'devui-dark-theme') {
    return true;
  }

  const { brand, isDark } = localStorage.getItem('user-custom-theme-config')
    ? JSON.parse(localStorage.getItem('user-custom-theme-config')!)
    : this.defaultCustom;

  return isDark;

}

export function getPopoverStyle(style?: any): any {
  if (isDark()) {
    return { ...DARK_THEME_POPOVER_STYLE, ...style };
  }
  return LIGHT_THEME_POPOVER_STYLE;
}
