import { Component } from '@angular/core';

interface PwType {
  key: string;
  name: string;
  desc: string;
  sets: string[]; // 每个字符集至少出现一个
}

interface GeneratedPw {
  type: PwType;
  value: string;
}

@Component({
  selector: 'app-password-gen',
  templateUrl: './password-gen.component.html',
  styleUrls: [ './password-gen.component.less' ],
})
export class PasswordGenComponent {
  // 长度选择
  lengthPresets = [ 8, 16, 32, 64 ];
  length = 16;
  useCustom = false;
  customLength = 20;

  // 三种密码类型（按需求定义字符集）
  types: PwType[] = [
    {
      key: 'full',
      name: '类型一：数字 + 大小写字母 + 特殊符号',
      desc: '数字、大写、小写、特殊符号各至少 1 个',
      sets: [
        '0123456789',
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '!@#$%^&*()_+-=[]{}|;:,.<>?',
      ],
    },
    {
      key: 'alnum',
      name: '类型二：数字 + 大小写字母',
      desc: '数字、大写、小写各至少 1 个（无特殊符号）',
      sets: [
        '0123456789',
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ],
    },
    {
      key: 'custom-set',
      name: '类型三：数字 + 指定字母 + 指定特殊符号',
      desc: '数字、指定小写、指定大写、!@#$%^&*()_+-= 各至少 1 个',
      sets: [
        '0123456789',
        'abcdefghijklmnpqrstuvwxyz', // 按需求：不含 o
        'ABCDEFGHIJKLMNPQRSTUVWXYZ', // 按需求：不含 O
        '!@#$%^&*()_+-=',
      ],
    },
  ];

  results: GeneratedPw[] = [];
  errorMsg = '';
  okMsg = '';

  get effectiveLength(): number {
    return this.useCustom ? this.customLength : this.length;
  }

  selectPreset(n: number): void {
    this.useCustom = false;
    this.length = n;
  }

  generateAll(): void {
    this.errorMsg = '';
    this.okMsg = '';
    const len = this.effectiveLength;
    if (!Number.isInteger(len) || len < 1) {
      this.errorMsg = '请输入有效的密码长度';
      this.results = [];
      return;
    }
    try {
      this.results = this.types.map((t) => ({ type: t, value: this.generateOne(t, len) }));
      this.okMsg = `已生成 3 个 ${len} 位密码`;
    } catch (e: any) {
      this.errorMsg = e?.message || String(e);
      this.results = [];
    }
  }

  regenerate(item: GeneratedPw): void {
    this.errorMsg = '';
    const len = this.effectiveLength;
    try {
      item.value = this.generateOne(item.type, len);
      this.okMsg = '已重新生成';
    } catch (e: any) {
      this.errorMsg = e?.message || String(e);
    }
  }

  // 保证每个字符集至少一个，其余从全集随机，最后洗牌
  private generateOne(type: PwType, len: number): string {
    const sets = type.sets;
    if (len < sets.length) {
      throw new Error(`长度至少为 ${sets.length}，才能保证每类字符至少 1 个`);
    }
    const all = sets.join('');
    const chars: string[] = [];

    // 每个字符集先各取一个
    for (const set of sets) {
      chars.push(set[this.randInt(set.length)]);
    }
    // 剩余从全集补齐
    for (let i = sets.length; i < len; i++) {
      chars.push(all[this.randInt(all.length)]);
    }
    // Fisher–Yates 洗牌，消除「前几位固定类别」的规律
    this.shuffle(chars);
    return chars.join('');
  }

  // 加密安全的均匀随机整数 [0, max)，用拒绝采样避免取模偏置
  private randInt(max: number): number {
    if (max <= 0) {
      return 0;
    }
    const limit = Math.floor(0xffffffff / max) * max;
    const buf = new Uint32Array(1);
    let x = 0;
    do {
      window.crypto.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);
    return x % max;
  }

  private shuffle(arr: string[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.randInt(i + 1);
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }

  copy(text: string): void {
    if (!text) {
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => this.fallbackCopy(text));
    } else {
      this.fallbackCopy(text);
    }
    this.okMsg = '已复制到剪贴板';
    this.errorMsg = '';
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
