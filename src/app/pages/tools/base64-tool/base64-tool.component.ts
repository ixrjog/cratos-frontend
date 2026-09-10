import { Component } from '@angular/core';

@Component({
  selector: 'app-base64-tool',
  templateUrl: './base64-tool.component.html',
  styleUrls: [ './base64-tool.component.less' ],
})
export class Base64ToolComponent {
  input = '';
  output = '';

  urlSafe = false; // URL-safe 变体：+/ -> -_，去掉末尾 =

  errorMsg = '';
  okMsg = '';

  // 文件模式
  fileName = '';
  fileMime = '';

  // 文本编码：UTF-8 安全（先 encodeURIComponent 再 btoa 的现代等价实现）
  encode(): void {
    this.run(() => {
      if (!this.input) {
        throw new Error('请输入要编码的文本');
      }
      const bytes = new TextEncoder().encode(this.input);
      let b64 = this.bytesToBase64(bytes);
      if (this.urlSafe) {
        b64 = this.toUrlSafe(b64);
      }
      this.output = b64;
      this.okMsg = '编码成功';
    });
  }

  decode(): void {
    this.run(() => {
      const src = (this.input || '').trim();
      if (!src) {
        throw new Error('请输入要解码的 Base64');
      }
      const bytes = this.base64ToBytes(this.fromUrlSafe(src));
      this.output = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      this.okMsg = '解码成功';
    });
  }

  // 选择文件 -> 编码为 Base64（可选带 data URI 前缀）
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (!file) {
      return;
    }
    this.fileName = file.name;
    this.fileMime = file.type || 'application/octet-stream';
    this.errorMsg = '';
    this.okMsg = '';

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);
        let b64 = this.bytesToBase64(bytes);
        if (this.urlSafe) {
          b64 = this.toUrlSafe(b64);
        }
        this.input = `${file.name}（${this.humanSize(file.size)}）`;
        this.output = b64;
        this.okMsg = `文件已编码为 Base64（${this.humanSize(file.size)}）`;
      } catch (e: any) {
        this.errorMsg = `文件编码失败：${e?.message || e}`;
      }
    };
    reader.onerror = () => {
      this.errorMsg = '文件读取失败';
    };
    reader.readAsArrayBuffer(file);

    // 允许再次选择同一文件
    target.value = '';
  }

  // 输出为 data URI（便于直接放到 img/href）
  makeDataUri(): void {
    this.run(() => {
      if (!this.output) {
        throw new Error('先编码出 Base64 内容');
      }
      const mime = this.fileMime || 'application/octet-stream';
      const std = this.fromUrlSafe(this.output);
      this.output = `data:${mime};base64,${std}`;
      this.okMsg = '已生成 data URI';
    });
  }

  // 把当前 Base64 输出解码并作为文件下载
  downloadDecoded(): void {
    this.run(() => {
      let src = (this.output || this.input || '').trim();
      if (!src) {
        throw new Error('没有可下载的 Base64 内容');
      }
      let mime = this.fileMime || 'application/octet-stream';
      const dataUriMatch = src.match(/^data:([^;]+);base64,(.*)$/s);
      if (dataUriMatch) {
        mime = dataUriMatch[1];
        src = dataUriMatch[2];
      }
      const bytes = this.base64ToBytes(this.fromUrlSafe(src));
      const blob = new Blob([ bytes ], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName || 'decoded.bin';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.okMsg = '已开始下载解码后的文件';
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
    this.fileName = '';
    this.fileMime = '';
    this.errorMsg = '';
    this.okMsg = '';
  }

  // ---- helpers ----

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunk = 0x8000; // 分块避免 apply 参数过多
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as any);
    }
    return btoa(binary);
  }

  private base64ToBytes(b64: string): Uint8Array {
    const normalized = b64.replace(/\s+/g, '');
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private toUrlSafe(b64: string): string {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private fromUrlSafe(b64: string): string {
    let s = b64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) {
      s += '='.repeat(4 - pad);
    }
    return s;
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

  private run(fn: () => void): void {
    this.errorMsg = '';
    this.okMsg = '';
    try {
      fn();
    } catch (e: any) {
      this.output = '';
      this.errorMsg = `处理失败：${e?.message || e}`;
    }
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
