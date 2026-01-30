import { Injectable } from '@angular/core';
import { EncryptionConfig } from '../config/encryption.config';

/**
 * Body 加密服务（混合加密：RSA + AES）
 */
@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  // 缓存当前请求的 AES 密钥（用于解密响应）
  private currentAESKey: CryptoKey | null = null;

  /**
   * 加密 Body
   * @param data 原始数据对象
   * @returns 加密后的数据 {encryptedBody, encryptedKey}
   */
  async encryptBody(data: any): Promise<{ encryptedBody: string; encryptedKey: string }> {
    // 1. 生成随机 AES 密钥
    const aesKey = await this.generateAESKey();

    // 2. 缓存 AES 密钥（用于解密响应）
    this.currentAESKey = aesKey;

    // 3. 用 AES 加密 Body
    const jsonString = JSON.stringify(data);
    const encryptedBody = await this.encryptWithAES(jsonString, aesKey);

    // 4. 用 RSA 公钥加密 AES 密钥
    const encryptedKey = await this.encryptWithRSA(aesKey);

    return { encryptedBody, encryptedKey };
  }

  /**
   * 解密响应数据
   * @param encryptedResponse 加密的响应数据（格式: Base64(IV).Base64(Ciphertext)）
   * @returns 解密后的原始数据对象
   */
  async decryptResponse(encryptedResponse: string): Promise<any> {
    if (!this.currentAESKey) {
      throw new Error('No AES key available for decryption');
    }

    try {
      // 解析格式: Base64(IV).Base64(Ciphertext)
      const [ivBase64, ciphertextBase64] = encryptedResponse.split('.');
      if (!ivBase64 || !ciphertextBase64) {
        throw new Error('Invalid encrypted response format');
      }

      // Base64 解码
      const iv = this.base64ToArrayBuffer(ivBase64);
      const ciphertext = this.base64ToArrayBuffer(ciphertextBase64);

      // AES-GCM 解密
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        this.currentAESKey,
        ciphertext
      );

      // 转换为字符串并解析 JSON
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decrypted);
      
      return JSON.parse(jsonString);
    } finally {
      // 清除密钥缓存
      this.currentAESKey = null;
    }
  }

  /**
   * 清除缓存的 AES 密钥
   */
  clearAESKey(): void {
    this.currentAESKey = null;
  }

  /**
   * 生成随机 AES-256 密钥
   */
  private generateAESKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']  // 添加 decrypt 权限
    );
  }

  /**
   * AES-GCM 加密
   */
  private async encryptWithAES(plaintext: string, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );

    // 格式: Base64(IV).Base64(Ciphertext)
    const ivBase64 = this.arrayBufferToBase64(iv);
    const encryptedBase64 = this.arrayBufferToBase64(encrypted);

    return `${ivBase64}.${encryptedBase64}`;
  }

  /**
   * RSA 加密 AES 密钥
   */
  private async encryptWithRSA(aesKey: CryptoKey): Promise<string> {
    // 导出 AES 密钥为原始字节
    const rawKey = await crypto.subtle.exportKey('raw', aesKey);

    // 导入 RSA 公钥
    const publicKey = await this.importRSAPublicKey();

    // 用 RSA 加密 AES 密钥
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP', hash: { name: 'SHA-256' } } as RsaOaepParams,
      publicKey,
      rawKey
    );

    return this.arrayBufferToBase64(encrypted);
  }

  /**
   * 导入 RSA 公钥
   */
  private async importRSAPublicKey(): Promise<CryptoKey> {
    // Base64 解码得到 PEM 格式字符串
    const pemString = atob(EncryptionConfig.publicKeyBase64);
    
    // 移除 PEM 格式的头尾和换行符
    const pemContents = pemString
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');

    // Base64 解码得到二进制数据
    const binaryDer = this.base64ToArrayBuffer(pemContents);

    // 导入公钥
    return crypto.subtle.importKey(
      'spki',
      binaryDer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );
  }

  /**
   * ArrayBuffer 转 Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Base64 转 ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
