import { Component } from '@angular/core';

interface HashRow {
  algo: string;
  value: string;
}

@Component({
  selector: 'app-hash-tool',
  templateUrl: './hash-tool.component.html',
  styleUrls: [ './hash-tool.component.less' ],
})
export class HashToolComponent {
  input = '';
  upper = false; // 十六进制大写

  fileName = '';
  computing = false;
  errorMsg = '';
  okMsg = '';

  rows: HashRow[] = [];

  private lastBytes: Uint8Array | null = null;

  async computeText(): Promise<void> {
    const bytes = new TextEncoder().encode(this.input || '');
    await this.computeBytes(bytes, `文本（${bytes.length} 字节）`);
  }

  async onFileSelected(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (!file) {
      return;
    }
    this.fileName = file.name;
    try {
      const buf = await file.arrayBuffer();
      await this.computeBytes(new Uint8Array(buf), `${file.name}（${this.humanSize(file.size)}）`);
    } catch (e: any) {
      this.errorMsg = `文件读取失败：${e?.message || e}`;
    } finally {
      target.value = ''; // 允许再次选择同一文件
    }
  }

  private async computeBytes(bytes: Uint8Array, sourceDesc: string): Promise<void> {
    this.errorMsg = '';
    this.okMsg = '';
    this.rows = [];
    this.computing = true;
    this.lastBytes = bytes;
    try {
      const subtle = window.crypto?.subtle;
      const rows: HashRow[] = [];

      // MD5（内置实现，Web Crypto 不支持）
      rows.push({ algo: 'MD5', value: this.hex(md5(bytes)) });

      if (subtle) {
        const [ s1, s256, s384, s512 ] = await Promise.all([
          subtle.digest('SHA-1', bytes as any),
          subtle.digest('SHA-256', bytes as any),
          subtle.digest('SHA-384', bytes as any),
          subtle.digest('SHA-512', bytes as any),
        ]);
        rows.push({ algo: 'SHA-1', value: this.hex(new Uint8Array(s1)) });
        rows.push({ algo: 'SHA-256', value: this.hex(new Uint8Array(s256)) });
        rows.push({ algo: 'SHA-384', value: this.hex(new Uint8Array(s384)) });
        rows.push({ algo: 'SHA-512', value: this.hex(new Uint8Array(s512)) });
      } else {
        this.errorMsg = '当前环境不支持 Web Crypto（SHA 系列），仅计算了 MD5';
      }

      this.rows = rows;
      this.okMsg = `已计算：${sourceDesc}`;
    } catch (e: any) {
      this.errorMsg = `计算失败：${e?.message || e}`;
    } finally {
      this.computing = false;
    }
  }

  toggleCase(): void {
    // 仅切换展示大小写，重算 hex 输出
    if (this.lastBytes) {
      this.rows = this.rows.map((r) => ({ algo: r.algo, value: this.upper ? r.value.toUpperCase() : r.value.toLowerCase() }));
    }
  }

  clear(): void {
    this.input = '';
    this.fileName = '';
    this.rows = [];
    this.errorMsg = '';
    this.okMsg = '';
    this.lastBytes = null;
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

  private hex(bytes: Uint8Array): string {
    let s = '';
    for (let i = 0; i < bytes.length; i++) {
      s += bytes[i].toString(16).padStart(2, '0');
    }
    return this.upper ? s.toUpperCase() : s;
  }

  private humanSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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

// ---------------- 内置 MD5（RFC 1321），无外部依赖 ----------------
function md5(input: Uint8Array): Uint8Array {
  const rotl = (x: number, c: number) => (x << c) | (x >>> (32 - c));
  const add = (a: number, b: number) => (a + b) | 0;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K: number[] = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
  }

  const msgLen = input.length;
  const bitLen = msgLen * 8;
  // padding: 追加 0x80，补 0 至 mod 64 == 56，再加 8 字节小端长度
  const totalLen = ((msgLen + 8) >>> 6) * 64 + 64;
  const padded = new Uint8Array(totalLen);
  padded.set(input);
  padded[msgLen] = 0x80;
  // 64 位长度（小端），高 32 位实际上可忽略，但按低 32 位写入
  const lenLo = bitLen >>> 0;
  const lenHi = Math.floor(bitLen / 0x100000000) >>> 0;
  const dv = new DataView(padded.buffer);
  dv.setUint32(totalLen - 8, lenLo, true);
  dv.setUint32(totalLen - 4, lenHi, true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  const M = new Int32Array(16);
  for (let off = 0; off < totalLen; off += 64) {
    for (let j = 0; j < 16; j++) {
      M[j] = dv.getUint32(off + j * 4, true);
    }
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = add(add(add(F, A), K[i]), M[g]);
      A = D;
      D = C;
      C = B;
      B = add(B, rotl(F, s[i]));
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }

  const out = new Uint8Array(16);
  const outDv = new DataView(out.buffer);
  outDv.setUint32(0, a0 >>> 0, true);
  outDv.setUint32(4, b0 >>> 0, true);
  outDv.setUint32(8, c0 >>> 0, true);
  outDv.setUint32(12, d0 >>> 0, true);
  return out;
}
