/**
 * Body 加密配置
 */
export const EncryptionConfig = {
  // 是否启用加密
  enabled: false,

  // 密钥版本（用于密钥轮换）
  keyVersion: 'v1',

  // RSA 公钥（Base64 格式）
  publicKeyBase64: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEyWURxYXRqUFcvQ0NwK2dXOVBxYgpzdmJQMmNGUHFYVUdpK0dJaXEzN04wVVBoUFgwT3R6T1NxWmk4dDZoTkVxSzJEQjBpYWVHM3oxb3VKN2p3bGdVCndaWmt2QkgzSVlOYVlPaU1NNzVYWCt5RUpWeWEvU1FtMEtXM0xQK0dmMGJxL1Qycno0YWhKUWs0MFNQWHhPbzQKclFQcGlDR1QxVm5Vd1o3RzFCV2hWZW1kcGdYNHJsTFhYV0pPR3JMKzZvem5BRjZOdnVjYnF6a2xVZFUxYjlUNAovd1R3MndzenZjWFNGTkxrMXRKb0JZcGVVSVRsUm5MOXVDVTRRcy9DNE5pZEtHZ3ZVN1hFeit0bkU2eCtwUjc3CkJHeUYzbW80R215UnZzdlR5bTYrbnVnQmY4MVM5aFV6YTVlWXY3RGNzbmRqM3g2Q05BSU1LZ2l4Z2tIUkZUVGsKd3dJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==',

  // 加密标识 Header 名称
  encryptionHeader: 'X-Body-Encrypted',

  // 密钥版本 Header 名称
  keyVersionHeader: 'X-Encryption-Key-Version',
};
