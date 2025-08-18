export interface TerminalTheme {
  id: string;
  name: string;
  description?: string;
  colors: {
    foreground: string;
    background: string;
    cursor: string;
    cursorAccent?: string;
    selection?: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
  };
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
}

export const TERMINAL_THEMES: TerminalTheme[] = [
  {
    id: 'default',
    name: '默认主题',
    description: '经典的黑色背景终端主题',
    colors: {
      foreground: '#ffffff',
      background: '#000000',
      cursor: '#ffffff',
      selection: 'rgba(255, 255, 255, 0.3)',
      black: '#000000',
      red: '#cd0000',
      green: '#00cd00',
      yellow: '#cdcd00',
      blue: '#0000ee',
      magenta: '#cd00cd',
      cyan: '#00cdcd',
      white: '#e5e5e5',
      brightBlack: '#7f7f7f',
      brightRed: '#ff0000',
      brightGreen: '#00ff00',
      brightYellow: '#ffff00',
      brightBlue: '#5c5cff',
      brightMagenta: '#ff00ff',
      brightCyan: '#00ffff',
      brightWhite: '#ffffff'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'dark',
    name: '深色主题',
    description: '现代深色主题，护眼舒适',
    colors: {
      foreground: '#f8f8f2',
      background: '#282a36',
      cursor: '#f8f8f0',
      selection: 'rgba(68, 71, 90, 0.5)',
      black: '#21222c',
      red: '#ff5555',
      green: '#50fa7b',
      yellow: '#f1fa8c',
      blue: '#bd93f9',
      magenta: '#ff79c6',
      cyan: '#8be9fd',
      white: '#f8f8f2',
      brightBlack: '#6272a4',
      brightRed: '#ff6e6e',
      brightGreen: '#69ff94',
      brightYellow: '#ffffa5',
      brightBlue: '#d6acff',
      brightMagenta: '#ff92df',
      brightCyan: '#a4ffff',
      brightWhite: '#ffffff'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'light',
    name: '浅色主题',
    description: '明亮的浅色主题，适合白天使用',
    colors: {
      foreground: '#383a42',
      background: '#fafafa',
      cursor: '#383a42',
      selection: 'rgba(56, 58, 66, 0.15)',
      black: '#383a42',
      red: '#e45649',
      green: '#50a14f',
      yellow: '#c18401',
      blue: '#4078f2',
      magenta: '#a626a4',
      cyan: '#0184bc',
      white: '#fafafa',
      brightBlack: '#4f525e',
      brightRed: '#e06c75',
      brightGreen: '#98c379',
      brightYellow: '#e5c07b',
      brightBlue: '#61afef',
      brightMagenta: '#c678dd',
      brightCyan: '#56b6c2',
      brightWhite: '#ffffff'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: '经典的Monokai配色方案',
    colors: {
      foreground: '#f8f8f2',
      background: '#272822',
      cursor: '#f8f8f0',
      selection: 'rgba(73, 72, 62, 0.5)',
      black: '#272822',
      red: '#f92672',
      green: '#a6e22e',
      yellow: '#f4bf75',
      blue: '#66d9ef',
      magenta: '#ae81ff',
      cyan: '#a1efe4',
      white: '#f8f8f2',
      brightBlack: '#75715e',
      brightRed: '#f92672',
      brightGreen: '#a6e22e',
      brightYellow: '#f4bf75',
      brightBlue: '#66d9ef',
      brightMagenta: '#ae81ff',
      brightCyan: '#a1efe4',
      brightWhite: '#f9f8f5'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Solarized深色主题，科学配色',
    colors: {
      foreground: '#839496',
      background: '#002b36',
      cursor: '#839496',
      selection: 'rgba(7, 54, 66, 0.5)',
      black: '#073642',
      red: '#dc322f',
      green: '#859900',
      yellow: '#b58900',
      blue: '#268bd2',
      magenta: '#d33682',
      cyan: '#2aa198',
      white: '#eee8d5',
      brightBlack: '#002b36',
      brightRed: '#cb4b16',
      brightGreen: '#586e75',
      brightYellow: '#657b83',
      brightBlue: '#839496',
      brightMagenta: '#6c71c4',
      brightCyan: '#93a1a1',
      brightWhite: '#fdf6e3'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    description: 'Solarized浅色主题，护眼配色',
    colors: {
      foreground: '#657b83',
      background: '#fdf6e3',
      cursor: '#657b83',
      selection: 'rgba(238, 232, 213, 0.5)',
      black: '#073642',
      red: '#dc322f',
      green: '#859900',
      yellow: '#b58900',
      blue: '#268bd2',
      magenta: '#d33682',
      cyan: '#2aa198',
      white: '#eee8d5',
      brightBlack: '#002b36',
      brightRed: '#cb4b16',
      brightGreen: '#586e75',
      brightYellow: '#657b83',
      brightBlue: '#839496',
      brightMagenta: '#6c71c4',
      brightCyan: '#93a1a1',
      brightWhite: '#fdf6e3'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub风格的浅色主题',
    colors: {
      foreground: '#24292e',
      background: '#ffffff',
      cursor: '#24292e',
      selection: 'rgba(3, 102, 214, 0.15)',
      black: '#24292e',
      red: '#d73a49',
      green: '#28a745',
      yellow: '#ffd33d',
      blue: '#0366d6',
      magenta: '#ea4aaa',
      cyan: '#17a2b8',
      white: '#f6f8fa',
      brightBlack: '#959da5',
      brightRed: '#cb2431',
      brightGreen: '#22863a',
      brightYellow: '#b08800',
      brightBlue: '#005cc5',
      brightMagenta: '#e36209',
      brightCyan: '#044289',
      brightWhite: '#ffffff'
    },
    fontSize: 14,
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    lineHeight: 1.45
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    description: 'Atom One Dark主题',
    colors: {
      foreground: '#abb2bf',
      background: '#282c34',
      cursor: '#528bff',
      selection: 'rgba(67, 76, 94, 0.5)',
      black: '#282c34',
      red: '#e06c75',
      green: '#98c379',
      yellow: '#e5c07b',
      blue: '#61afef',
      magenta: '#c678dd',
      cyan: '#56b6c2',
      white: '#abb2bf',
      brightBlack: '#5c6370',
      brightRed: '#e06c75',
      brightGreen: '#98c379',
      brightYellow: '#e5c07b',
      brightBlue: '#61afef',
      brightMagenta: '#c678dd',
      brightCyan: '#56b6c2',
      brightWhite: '#ffffff'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Nord极地风格主题',
    colors: {
      foreground: '#d8dee9',
      background: '#2e3440',
      cursor: '#d8dee9',
      selection: 'rgba(76, 86, 106, 0.5)',
      black: '#3b4252',
      red: '#bf616a',
      green: '#a3be8c',
      yellow: '#ebcb8b',
      blue: '#81a1c1',
      magenta: '#b48ead',
      cyan: '#88c0d0',
      white: '#e5e9f0',
      brightBlack: '#4c566a',
      brightRed: '#bf616a',
      brightGreen: '#a3be8c',
      brightYellow: '#ebcb8b',
      brightBlue: '#81a1c1',
      brightMagenta: '#b48ead',
      brightCyan: '#8fbcbb',
      brightWhite: '#eceff4'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  },
  {
    id: 'material',
    name: 'Material',
    description: 'Material Design风格主题',
    colors: {
      foreground: '#eeffff',
      background: '#263238',
      cursor: '#ffcc00',
      selection: 'rgba(128, 203, 196, 0.2)',
      black: '#000000',
      red: '#f07178',
      green: '#c3e88d',
      yellow: '#ffcb6b',
      blue: '#82aaff',
      magenta: '#c792ea',
      cyan: '#89ddff',
      white: '#ffffff',
      brightBlack: '#546e7a',
      brightRed: '#f07178',
      brightGreen: '#c3e88d',
      brightYellow: '#ffcb6b',
      brightBlue: '#82aaff',
      brightMagenta: '#c792ea',
      brightCyan: '#89ddff',
      brightWhite: '#ffffff'
    },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: 1.2
  }
];

export const DEFAULT_THEME_ID = 'default';

// 字体选项
export const FONT_FAMILIES = [
  { label: 'Monaco', value: 'Monaco, Menlo, "Ubuntu Mono", monospace' },
  { label: 'Consolas', value: 'Consolas, "Liberation Mono", Menlo, monospace' },
  { label: 'SF Mono', value: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace' },
  { label: 'Ubuntu Mono', value: '"Ubuntu Mono", Monaco, Menlo, monospace' },
  { label: 'Fira Code', value: '"Fira Code", Monaco, Menlo, monospace' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", Monaco, Menlo, monospace' },
  { label: 'Source Code Pro', value: '"Source Code Pro", Monaco, Menlo, monospace' }
];

// 字体大小选项
export const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24];

// 行高选项
export const LINE_HEIGHTS = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
