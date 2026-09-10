import { Component } from '@angular/core';

type KeyKind = 'ed25519' | 'rsa';

@Component({
  selector: 'app-ssh-keygen',
  templateUrl: './ssh-keygen.component.html',
  styleUrls: [ './ssh-keygen.component.less' ],
})
export class SshKeygenComponent {
  kind: KeyKind = 'ed25519';
  kindOptions = [
    { label: 'Ed25519 (推荐)', value: 'ed25519' },
    { label: 'RSA', value: 'rsa' },
  ];

  rsaBits = 3072;
  rsaBitsOptions = [
    { label: '2048', value: 2048 },
    { label: '3072', value: 3072 },
    { label: '4096', value: 4096 },
  ];

  comment = '';

  generating = false;
  errorMsg = '';
  okMsg = '';

  publicKey = '';   // 单行 authorized_keys 格式
  privateKey = '';  // OpenSSH PEM
  fingerprint = ''; // SHA256:...

  async generate(): Promise<void> {
    this.errorMsg = '';
    this.okMsg = '';
    this.publicKey = '';
    this.privateKey = '';
    this.fingerprint = '';
    this.generating = true;
    try {
      const subtle = window.crypto?.subtle;
      if (!subtle) {
        throw new Error('当前环境不支持 Web Crypto（需要 HTTPS 或 localhost）');
      }
      if (this.kind === 'ed25519') {
        await this.generateEd25519(subtle);
      } else {
        await this.generateRsa(subtle);
      }
      this.fingerprint = await this.sha256Fingerprint(this.publicKeyBlob!);
      this.okMsg = '生成成功，私钥仅存在于本浏览器，请妥善保存';
    } catch (e: any) {
      this.errorMsg = this.explain(e);
    } finally {
      this.generating = false;
    }
  }

  private publicKeyBlob: Uint8Array | null = null;

  // ---------------- Ed25519 ----------------
  private async generateEd25519(subtle: SubtleCrypto): Promise<void> {
    let kp: CryptoKeyPair;
    try {
      kp = (await subtle.generateKey({ name: 'Ed25519' } as any, true, [ 'sign', 'verify' ])) as CryptoKeyPair;
    } catch {
      throw new Error('此浏览器暂不支持原生 Ed25519（需要较新的 Chrome/Safari/Firefox），可改用 RSA');
    }

    // 公钥：SPKI 末 32 字节即为原始公钥
    const spki = new Uint8Array(await subtle.exportKey('spki', kp.publicKey));
    const rawPub = spki.slice(spki.length - 32);

    // 私钥：PKCS#8，末 32 字节为原始种子
    const pkcs8 = new Uint8Array(await subtle.exportKey('pkcs8', kp.privateKey));
    const rawSeed = pkcs8.slice(pkcs8.length - 32);

    // 公钥 wire: string "ssh-ed25519" + string pub
    const pubBlob = this.concat(
      this.sshString(this.enc('ssh-ed25519')),
      this.sshString(rawPub),
    );
    this.publicKeyBlob = pubBlob;
    this.publicKey = `ssh-ed25519 ${this.b64(pubBlob)}${this.commentSuffix()}`;

    // OpenSSH 私钥的 ed25519 私钥字段 = string(pub, 32) + string(seed||pub, 64)
    const privKeyField = this.concat(
      this.sshString(rawPub),
      this.sshString(this.concat(rawSeed, rawPub)),
    );
    this.privateKey = this.buildOpenSshPrivateKey('ssh-ed25519', pubBlob, privKeyField);
  }

  // ---------------- RSA ----------------
  private async generateRsa(subtle: SubtleCrypto): Promise<void> {
    const kp = (await subtle.generateKey({
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: this.rsaBits,
      publicExponent: new Uint8Array([ 0x01, 0x00, 0x01 ]),
      hash: 'SHA-256',
    }, true, [ 'sign', 'verify' ])) as CryptoKeyPair;

    const jwkPub = await subtle.exportKey('jwk', kp.publicKey);
    const jwkPriv = await subtle.exportKey('jwk', kp.privateKey);

    const n = this.b64urlToBytes(jwkPub.n!);
    const e = this.b64urlToBytes(jwkPub.e!);

    // 公钥 wire: "ssh-rsa" + mpint(e) + mpint(n)
    const pubBlob = this.concat(
      this.sshString(this.enc('ssh-rsa')),
      this.sshString(this.mpint(e)),
      this.sshString(this.mpint(n)),
    );
    this.publicKeyBlob = pubBlob;
    this.publicKey = `ssh-rsa ${this.b64(pubBlob)}${this.commentSuffix()}`;

    // OpenSSH RSA 私钥字段: n, e, d, iqmp, p, q  (mpint)
    const d = this.b64urlToBytes(jwkPriv.d!);
    const p = this.b64urlToBytes(jwkPriv.p!);
    const q = this.b64urlToBytes(jwkPriv.q!);
    const iqmp = this.b64urlToBytes(jwkPriv.qi!);
    const privKeyField = this.concat(
      this.sshString(this.mpint(n)),
      this.sshString(this.mpint(e)),
      this.sshString(this.mpint(d)),
      this.sshString(this.mpint(iqmp)),
      this.sshString(this.mpint(p)),
      this.sshString(this.mpint(q)),
    );
    this.privateKey = this.buildOpenSshPrivateKey('ssh-rsa', pubBlob, privKeyField);
  }

  // ---------------- OpenSSH 私钥打包 ----------------
  // 格式参考 PROTOCOL.key: "openssh-key-v1\0" + cipher/kdf/kdfoptions + numkeys
  //   + string(pubkey) + string(encrypted-privatekeys-block)
  // 私钥块（cipher=none 时明文）: checkint*2 + keytype + <类型私钥字段> + comment + padding
  private buildOpenSshPrivateKey(keyType: string, pubBlob: Uint8Array, privKeyField: Uint8Array): string {
    const magic = this.enc('openssh-key-v1\0');
    const ciphername = this.sshString(this.enc('none'));
    const kdfname = this.sshString(this.enc('none'));
    const kdfoptions = this.sshString(new Uint8Array(0));
    const numKeys = this.u32(1);
    const pub = this.sshString(pubBlob);

    // checkint（随机一致的两个 4 字节）
    const checkint = new Uint8Array(4);
    window.crypto.getRandomValues(checkint);

    let priv = this.concat(
      checkint,
      checkint,
      this.sshString(this.enc(keyType)),
      privKeyField,
      this.sshString(this.enc(this.comment.trim())),
    );
    // padding 到 8 字节的整数倍：1,2,3...
    const blockSize = 8;
    const padLen = (blockSize - (priv.length % blockSize)) % blockSize;
    if (padLen > 0) {
      const pad = new Uint8Array(padLen);
      for (let i = 0; i < padLen; i++) {
        pad[i] = i + 1;
      }
      priv = this.concat(priv, pad);
    }

    const body = this.concat(magic, ciphername, kdfname, kdfoptions, numKeys, pub, this.sshString(priv));
    return this.toPem('OPENSSH PRIVATE KEY', body);
  }

  private async sha256Fingerprint(pubBlob: Uint8Array): Promise<string> {
    const digest = new Uint8Array(await window.crypto.subtle.digest('SHA-256', pubBlob));
    // OpenSSH 指纹：SHA256: + base64(无 padding)
    const b64 = this.b64(digest).replace(/=+$/, '');
    return `SHA256:${b64}`;
  }

  // ---------------- 通用编码 helpers ----------------
  private enc(s: string): Uint8Array {
    return new TextEncoder().encode(s);
  }

  private u32(n: number): Uint8Array {
    return new Uint8Array([ (n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff ]);
  }

  // SSH "string"：4 字节长度 + 内容
  private sshString(bytes: Uint8Array): Uint8Array {
    return this.concat(this.u32(bytes.length), bytes);
  }

  // SSH mpint：正整数，最高位为 1 时前置 0x00
  private mpint(bytes: Uint8Array): Uint8Array {
    let i = 0;
    while (i < bytes.length - 1 && bytes[i] === 0) {
      i++;
    }
    let v = bytes.slice(i);
    if (v.length > 0 && (v[0] & 0x80) !== 0) {
      v = this.concat(new Uint8Array([ 0x00 ]), v);
    }
    return v;
  }

  private concat(...arrs: Uint8Array[]): Uint8Array {
    const total = arrs.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const a of arrs) {
      out.set(a, off);
      off += a.length;
    }
    return out;
  }

  private b64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private b64urlToBytes(b64url: string): Uint8Array {
    let s = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) {
      s += '='.repeat(4 - pad);
    }
    const binary = atob(s);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  }

  private toPem(label: string, body: Uint8Array): string {
    const b64 = this.b64(body);
    const lines = b64.match(/.{1,70}/g) || [ b64 ];
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`;
  }

  private commentSuffix(): string {
    const c = this.comment.trim();
    return c ? ` ${c}` : '';
  }

  private explain(e: any): string {
    return `生成失败：${e?.message || e}`;
  }

  // ---------------- UI actions ----------------
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
  }

  download(text: string, filename: string): void {
    if (!text) {
      return;
    }
    const blob = new Blob([ text ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  get privFileName(): string {
    return this.kind === 'ed25519' ? 'id_ed25519' : 'id_rsa';
  }

  get pubFileName(): string {
    return `${this.privFileName}.pub`;
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
