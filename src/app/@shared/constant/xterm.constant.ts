import { ITerminalOptions } from '@xterm/xterm';

export const BASE_TERMINAL_OPTIONS: ITerminalOptions = {
  allowTransparency: true,
  fontSize: 12,
  lineHeight: 1.2,
  letterSpacing: 0,
  fontWeight: '400',
  fontFamily: 'Consolas, "Courier New", monospace',
  cursorBlink: false,
  theme: { background: '#263238' },
  scrollback: Number.MAX_SAFE_INTEGER,
  convertEol: true,
};
