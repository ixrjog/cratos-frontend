import { Component, OnInit, OnDestroy } from '@angular/core';
import { TerminalThemeService } from '../terminal-theme.service';
import { TerminalTheme } from '../terminal-themes.config';
import { Subscription } from 'rxjs';

interface DemoTerminal {
  id: string;
  title: string;
  content: string[];
  currentLine: string;
  isTyping: boolean;
  cursor: boolean;
}

@Component({
  selector: 'app-web-terminal-demo',
  templateUrl: './web-terminal-demo.component.html',
  styleUrls: ['./web-terminal-demo.component.less']
})
export class WebTerminalDemoComponent implements OnInit, OnDestroy {

  // 主题相关
  currentTheme: TerminalTheme | null = null;
  private themeSubscription: Subscription | null = null;
  private themeApplyTimeout: any = null; // 防抖定时器

  terminals: DemoTerminal[] = [
    {
      id: 'demo-1',
      title: 'demo-server-1',
      content: [
        'Last login: Mon Aug 19 10:30:15 2025 from 192.168.1.100',
        '[root@demo-server-1 ~]# pwd',
        '/root',
        '[root@demo-server-1 ~]# ls -la',
        'total 28',
        'drwx------  4 root root 4096 Aug 19 10:30 .',
        'drwxr-xr-x 18 root root 4096 Aug 19 09:15 ..',
        '-rw-------  1 root root 1234 Aug 19 10:25 .bash_history',
        '-rw-r--r--  1 root root  570 Jan 31  2010 .bashrc',
        'drwx------  2 root root 4096 Aug 19 09:20 .ssh'
      ],
      currentLine: '',
      isTyping: false,
      cursor: true
    },
    {
      id: 'demo-2', 
      title: 'demo-server-2',
      content: [
        'Last login: Mon Aug 19 10:30:15 2025 from 192.168.1.100',
        '[root@demo-server-2 ~]# pwd',
        '/root',
        '[root@demo-server-2 ~]# ls -la',
        'total 28',
        'drwx------  4 root root 4096 Aug 19 10:30 .',
        'drwxr-xr-x 18 root root 4096 Aug 19 09:15 ..',
        '-rw-------  1 root root 1234 Aug 19 10:25 .bash_history',
        '-rw-r--r--  1 root root  570 Jan 31  2010 .bashrc',
        'drwx------  2 root root 4096 Aug 19 09:20 .ssh'
      ],
      currentLine: '',
      isTyping: false,
      cursor: true
    },
    {
      id: 'demo-3',
      title: 'demo-server-3', 
      content: [
        'Last login: Mon Aug 19 10:30:15 2025 from 192.168.1.100',
        '[root@demo-server-3 ~]# pwd',
        '/root',
        '[root@demo-server-3 ~]# ls -la',
        'total 28',
        'drwx------  4 root root 4096 Aug 19 10:30 .',
        'drwxr-xr-x 18 root root 4096 Aug 19 09:15 ..',
        '-rw-------  1 root root 1234 Aug 19 10:25 .bash_history',
        '-rw-r--r--  1 root root  570 Jan 31  2010 .bashrc',
        'drwx------  2 root root 4096 Aug 19 09:20 .ssh'
      ],
      currentLine: '',
      isTyping: false,
      cursor: true
    },
    {
      id: 'demo-4',
      title: 'demo-server-4',
      content: [
        'Last login: Mon Aug 19 10:30:15 2025 from 192.168.1.100',
        '[root@demo-server-4 ~]# pwd',
        '/root',
        '[root@demo-server-4 ~]# ls -la',
        'total 28',
        'drwx------  4 root root 4096 Aug 19 10:30 .',
        'drwxr-xr-x 18 root root 4096 Aug 19 09:15 ..',
        '-rw-------  1 root root 1234 Aug 19 10:25 .bash_history',
        '-rw-r--r--  1 root root  570 Jan 31  2010 .bashrc',
        'drwx------  2 root root 4096 Aug 19 09:20 .ssh'
      ],
      currentLine: '',
      isTyping: false,
      cursor: true
    }
  ];

  private intervals: any[] = [];
  private typewriterIntervals: any[] = [];
  private currentCommandIndex = 0; // 当前命令索引
  private isGroupTyping = false; // 是否正在群控输入

  // 统一的群控命令队列 - 所有终端执行相同命令
  private groupControlCommands = [
    'mkdir -p /opt/cratos/demo',
    'cd /opt/cratos/demo',
    'pwd',
    '/opt/cratos/demo',
    'touch config.yaml',
    'ls -la',
    'total 8',
    'drwxr-xr-x 2 root root 4096 Aug 19 10:50 .',
    'drwxr-xr-x 3 root root 4096 Aug 19 10:50 ..',
    '-rw-r--r-- 1 root root    0 Aug 19 10:50 config.yaml',
    'echo "# Cratos Demo Configuration" > config.yaml',
    'cat config.yaml',
    '# Cratos Demo Configuration',
    'mkdir logs backups scripts',
    'tree',
    '.',
    '├── backups',
    '├── config.yaml',
    '├── logs',
    '└── scripts',
    '',
    '3 directories, 1 file',
    'cd ~'
  ];

  // 模拟命令队列 - 现在所有终端使用相同的命令
  private commandQueues = [
    [...this.groupControlCommands], // Demo Server 1
    [...this.groupControlCommands], // Demo Server 2  
    [...this.groupControlCommands], // Demo Server 3
    [...this.groupControlCommands]  // Demo Server 4
  ];

  // 原始命令队列备份，用于循环
  private originalCommandQueues = [
    [...this.groupControlCommands],
    [...this.groupControlCommands],
    [...this.groupControlCommands],
    [...this.groupControlCommands]
  ];

  constructor(private themeService: TerminalThemeService) {}

  ngOnInit(): void {
    // 先启动demo动画
    this.startDemoAnimation();
    
    // 延迟订阅主题变化，确保DOM已经渲染并且用户已经看到初始状态
    setTimeout(() => {
      // 先获取当前主题，避免订阅时的突然变化
      this.currentTheme = this.themeService.getCurrentTheme();
      
      // 然后订阅主题变化
      this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
        // 只有当主题真正发生变化时才应用
        if (this.currentTheme?.id !== theme.id) {
          this.currentTheme = theme;
          // 使用防抖机制，避免频繁应用主题
          if (this.themeApplyTimeout) {
            clearTimeout(this.themeApplyTimeout);
          }
          this.themeApplyTimeout = setTimeout(() => {
            this.applyThemeToTerminals();
          }, 100);
        }
      });
      
      // 初始应用主题
      this.applyThemeToTerminals();
    }, 1000); // 延迟1秒确保用户看到初始状态
  }

  ngOnDestroy(): void {
    // 清理所有定时器
    this.intervals.forEach(interval => clearInterval(interval));
    this.typewriterIntervals.forEach(interval => clearInterval(interval));
    
    // 清理主题订阅
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
    // 清理防抖定时器
    if (this.themeApplyTimeout) {
      clearTimeout(this.themeApplyTimeout);
    }
  }

  private startDemoAnimation(): void {
    // 启动光标闪烁动画
    this.startCursorBlinking();
    
    // 延迟启动群控打字机效果
    setTimeout(() => {
      this.startGroupControlTypewriter();
    }, 2000);
  }

  private startCursorBlinking(): void {
    this.terminals.forEach((terminal, index) => {
      const interval = setInterval(() => {
        terminal.cursor = !terminal.cursor;
      }, 500);
      this.intervals.push(interval);
    });
  }

  private startGroupControlTypewriter(): void {
    this.executeNextGroupCommand();
  }

  private executeNextGroupCommand(): void {
    if (this.isGroupTyping) return;
    
    // 检查是否需要重置命令队列
    if (this.currentCommandIndex >= this.groupControlCommands.length) {
      this.currentCommandIndex = 0;
    }

    const command = this.groupControlCommands[this.currentCommandIndex];
    this.currentCommandIndex++;

    // 判断是否是命令还是输出
    const isCommand = this.isCommandLine(command);
    
    if (isCommand) {
      // 同步在所有终端输入命令
      this.typeCommandInAllTerminals(command);
    } else {
      // 同步显示输出结果
      this.showOutputInAllTerminals(command);
    }
  }

  private isCommandLine(text: string): boolean {
    // 判断是否是命令行（不包含特殊输出格式）
    return !text.includes('total ') && 
           !text.includes('drwx') && 
           !text.includes('-rw-') && 
           !text.includes('├──') && 
           !text.includes('└──') && 
           !text.includes('directories') &&
           !text.startsWith('/') &&
           !text.startsWith('#') &&
           !text.startsWith('.') &&
           text.trim() !== '';
  }

  private typeCommandInAllTerminals(command: string): void {
    this.isGroupTyping = true;
    
    // 首先为所有终端添加提示符
    this.terminals.forEach((terminal, index) => {
      const serverNum = index + 1;
      const currentPath = this.getCurrentPath();
      const prompt = `[root@demo-server-${serverNum} ${currentPath}]# `;
      terminal.currentLine = prompt;
      terminal.isTyping = true;
    });

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < command.length) {
        // 同时在所有终端添加命令字符
        this.terminals.forEach(terminal => {
          terminal.currentLine += command[charIndex];
        });
        
        // 在打字过程中也滚动到底部
        if (charIndex % 5 === 0) { // 每5个字符滚动一次，避免过于频繁
          this.scrollToBottom();
        }
        
        charIndex++;
      } else {
        clearInterval(typeInterval);
        
        // 完成输入后，将完整的行（提示符+命令）添加到内容中
        this.terminals.forEach((terminal, index) => {
          terminal.content.push(terminal.currentLine);
          terminal.currentLine = '';
          terminal.isTyping = false;
          
          // 保持内容在合理范围内
          if (terminal.content.length > 25) {
            terminal.content.shift();
          }
        });
        
        // 滚动到底部
        this.scrollToBottom();
        
        this.isGroupTyping = false;
        
        // 延迟后执行下一个命令
        setTimeout(() => {
          this.executeNextGroupCommand();
        }, 1500);
      }
    }, 80); // 统一的打字速度

    this.typewriterIntervals.push(typeInterval);
  }

  private showOutputInAllTerminals(output: string): void {
    // 直接在所有终端显示输出
    this.terminals.forEach(terminal => {
      terminal.content.push(output);
      
      // 保持内容在合理范围内
      if (terminal.content.length > 25) {
        terminal.content.shift();
      }
    });
    
    // 滚动到底部
    this.scrollToBottom();
    
    // 短暂延迟后继续下一行
    setTimeout(() => {
      this.executeNextGroupCommand();
    }, 300);
  }

  private getCurrentPath(): string {
    // 根据当前命令索引判断当前路径
    const commandsSoFar = this.groupControlCommands.slice(0, this.currentCommandIndex);
    const cdCommands = commandsSoFar.filter(cmd => cmd.startsWith('cd '));
    
    if (cdCommands.length === 0) {
      return '~';
    }
    
    const lastCdCommand = cdCommands[cdCommands.length - 1];
    if (lastCdCommand.includes('/opt/cratos/demo')) {
      return 'demo';
    } else if (lastCdCommand.includes('~')) {
      return '~';
    }
    
    return '~';
  }

  private scrollToBottom(): void {
    // 使用setTimeout确保DOM更新后再滚动
    setTimeout(() => {
      this.terminals.forEach((terminal, index) => {
        const terminalElement = document.querySelector(`#demo-terminal-${terminal.id}`) as HTMLElement;
        if (terminalElement) {
          // 使用平滑滚动到底部
          terminalElement.scrollTo({
            top: terminalElement.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }, 10); // 减少延迟，使滚动更及时
  }

  private applyThemeToTerminals(): void {
    if (!this.currentTheme) return;
    
    setTimeout(() => {
      this.terminals.forEach(terminal => {
        const terminalElement = document.querySelector(`#demo-terminal-${terminal.id}`) as HTMLElement;
        if (terminalElement) {
          // 应用主题颜色
          terminalElement.style.backgroundColor = this.currentTheme!.colors.background;
          terminalElement.style.color = this.currentTheme!.colors.foreground;
          
          // 应用字体设置
          if (this.currentTheme!.fontFamily) {
            terminalElement.style.fontFamily = this.currentTheme!.fontFamily;
          }
          // Demo终端固定使用12px字体大小
          terminalElement.style.fontSize = '12px';
          
          if (this.currentTheme!.lineHeight) {
            terminalElement.style.lineHeight = this.currentTheme!.lineHeight.toString();
          }
          if (this.currentTheme!.letterSpacing) {
            terminalElement.style.letterSpacing = `${this.currentTheme!.letterSpacing}px`;
          }

          // 应用光标颜色
          const cursorElements = terminalElement.querySelectorAll('.demo-cursor') as NodeListOf<HTMLElement>;
          cursorElements.forEach(cursor => {
            cursor.style.color = this.currentTheme!.colors.cursor;
          });

          // 应用选择颜色（如果有的话）
          if (this.currentTheme!.colors.selection) {
            terminalElement.style.setProperty('--selection-color', this.currentTheme!.colors.selection);
          }
        }
      });
    }, 100);
  }

  // TrackBy函数用于优化*ngFor性能
  trackByTerminalId(index: number, terminal: DemoTerminal): string {
    return terminal.id;
  }
}
