import { Component } from '@angular/core';

@Component({
  selector: 'app-json-formatter',
  templateUrl: './json-formatter.component.html',
  styleUrls: [ './json-formatter.component.less' ],
})
export class JsonFormatterComponent {
  input = '';
  output = '';

  indent = 2;
  indentOptions = [
    { label: '2 空格', value: 2 },
    { label: '4 空格', value: 4 },
    { label: 'Tab', value: -1 },
    { label: '压缩(无缩进)', value: 0 },
  ];

  errorMsg = '';
  okMsg = '';

  private get indentArg(): string | number {
    if (this.indent === -1) {
      return '\t';
    }
    return this.indent;
  }

  // 美化 / 格式化
  format(): void {
    this.run(() => {
      const obj = this.parse(this.input);
      this.output = JSON.stringify(obj, null, this.indentArg);
      this.okMsg = '格式化成功';
    });
  }

  // 压缩为单行
  minify(): void {
    this.run(() => {
      const obj = this.parse(this.input);
      this.output = JSON.stringify(obj);
      this.okMsg = '压缩成功';
    });
  }

  // 仅校验，不改变输出
  validate(): void {
    this.run(() => {
      this.parse(this.input);
      this.okMsg = 'JSON 合法 ✓';
    });
  }

  // 转义为字符串字面量（把 JSON 变成可嵌入代码的字符串）
  escape(): void {
    this.run(() => {
      // 先确认合法，再输出转义后的字符串字面量
      this.parse(this.input);
      this.output = JSON.stringify(this.input);
      this.okMsg = '已转义为字符串';
    });
  }

  // 反转义：把一个 JSON 字符串字面量解开
  unescape(): void {
    this.run(() => {
      const unescaped = JSON.parse(this.input);
      if (typeof unescaped !== 'string') {
        throw new Error('输入不是一个 JSON 字符串字面量');
      }
      this.output = unescaped;
      this.okMsg = '已反转义';
    });
  }

  copyOutput(): void {
    if (!this.output) {
      return;
    }
    this.copyText(this.output);
    this.okMsg = '已复制到剪贴板';
    this.errorMsg = '';
  }

  useOutputAsInput(): void {
    if (!this.output) {
      return;
    }
    this.input = this.output;
    this.output = '';
    this.okMsg = '';
    this.errorMsg = '';
  }

  clear(): void {
    this.input = '';
    this.output = '';
    this.errorMsg = '';
    this.okMsg = '';
  }

  private parse(text: string): any {
    const trimmed = (text || '').trim();
    if (!trimmed) {
      throw new Error('请输入 JSON 内容');
    }
    return JSON.parse(trimmed);
  }

  private run(fn: () => void): void {
    this.errorMsg = '';
    this.okMsg = '';
    try {
      fn();
    } catch (e: any) {
      this.output = '';
      this.errorMsg = this.friendlyError(e);
    }
  }

  // 尽量给出出错位置（行列）
  private friendlyError(e: any): string {
    const raw: string = e?.message || String(e);
    const posMatch = raw.match(/position\s+(\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const before = (this.input || '').slice(0, pos);
      const line = before.split('\n').length;
      const col = pos - before.lastIndexOf('\n');
      return `解析失败（第 ${line} 行，第 ${col} 列）：${raw}`;
    }
    return `解析失败：${raw}`;
  }

  private copyText(text: string): void {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => this.fallbackCopy(text));
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }
}
