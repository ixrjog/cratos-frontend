import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestSignService {

  /**
   * 生成请求签名 headers: Jti, Timestamp, Jwt-Sign
   * Sign = HMAC-SHA256(Jti + Timestamp + ContentLength, token)
   * 注意：Content-Length 在发送时由浏览器自动计算，这里用 '0' 占位（GET 请求）
   * POST 请求的 Content-Length 需要在实际发送时计算
   */
  generateSignHeaders(token: string, encryptedBody?: string): { [key: string]: string } | null {
    const jti = localStorage.getItem('jti');
    if (!jti) {
      return null;
    }
    const timestamp = String(Date.now());
    const bodyHash = encryptedBody ? this.sha256Hex(encryptedBody) : '';
    const sign = this.hmacSha256(jti + timestamp + bodyHash, token);
    const headers: { [key: string]: string } = {
      'Jti': jti,
      'Timestamp': timestamp,
      'Jwt-Sign': sign,
    };
    return headers;
  }

  sha256Hex(data: string): string {
    const bytes = new TextEncoder().encode(data);
    const hash = this.sha256(bytes);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private hmacSha256(data: string, key: string): string {
    // 使用 Web Crypto API 的同步替代：简单 HMAC 实现
    // 由于 Web Crypto 是异步的，这里用 js 实现的 HMAC-SHA256
    return this.hmacSha256Sync(data, key);
  }

  private hmacSha256Sync(message: string, key: string): string {
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(key);
    const msgBytes = encoder.encode(message);

    // SHA-256 block size = 64 bytes
    const blockSize = 64;
    let keyBlock = new Uint8Array(blockSize);

    if (keyBytes.length > blockSize) {
      keyBlock.set(new Uint8Array(this.sha256(keyBytes)).slice(0, blockSize));
    } else {
      keyBlock.set(keyBytes);
    }

    const ipad = new Uint8Array(blockSize);
    const opad = new Uint8Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
      ipad[i] = keyBlock[i] ^ 0x36;
      opad[i] = keyBlock[i] ^ 0x5c;
    }

    const inner = new Uint8Array(blockSize + msgBytes.length);
    inner.set(ipad);
    inner.set(msgBytes, blockSize);
    const innerHash = this.sha256(inner);

    const outer = new Uint8Array(blockSize + 32);
    outer.set(opad);
    outer.set(new Uint8Array(innerHash), blockSize);
    const hmac = this.sha256(outer);

    return btoa(String.fromCharCode(...new Uint8Array(hmac)));
  }

  private sha256(data: Uint8Array): ArrayBuffer {
    // Minimal SHA-256 implementation
    const K = new Uint32Array([
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ]);

    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

    const msgLen = data.length;
    const bitLen = msgLen * 8;
    const padLen = ((msgLen + 8) % 64 === 0) ? msgLen + 8 : msgLen + 64 - ((msgLen + 8) % 64);
    const padded = new Uint8Array(padLen + 8);
    padded.set(data);
    padded[msgLen] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 4, bitLen, false);

    for (let offset = 0; offset < padded.length; offset += 64) {
      const w = new Uint32Array(64);
      for (let i = 0; i < 16; i++) {
        w[i] = view.getUint32(offset + i * 4, false);
      }
      for (let i = 16; i < 64; i++) {
        const s0 = (this.rotr(w[i - 15], 7) ^ this.rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)) >>> 0;
        const s1 = (this.rotr(w[i - 2], 17) ^ this.rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)) >>> 0;
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }

      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      for (let i = 0; i < 64; i++) {
        const S1 = (this.rotr(e, 6) ^ this.rotr(e, 11) ^ this.rotr(e, 25)) >>> 0;
        const ch = ((e & f) ^ (~e & g)) >>> 0;
        const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = (this.rotr(a, 2) ^ this.rotr(a, 13) ^ this.rotr(a, 22)) >>> 0;
        const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
        const temp2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + temp1) >>> 0;
        d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }

    const result = new ArrayBuffer(32);
    const resultView = new DataView(result);
    resultView.setUint32(0, h0, false); resultView.setUint32(4, h1, false);
    resultView.setUint32(8, h2, false); resultView.setUint32(12, h3, false);
    resultView.setUint32(16, h4, false); resultView.setUint32(20, h5, false);
    resultView.setUint32(24, h6, false); resultView.setUint32(28, h7, false);
    return result;
  }

  private rotr(n: number, d: number): number {
    return ((n >>> d) | (n << (32 - d))) >>> 0;
  }
}
