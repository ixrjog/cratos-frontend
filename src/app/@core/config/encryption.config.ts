/**
 * Body 加密配置
 */
export const EncryptionConfig = {
  // 是否启用加密
  enabled: true,

  // 密钥版本（用于密钥轮换）
  keyVersion: 'v1',

  // RSA 公钥（Base64 格式）
  publicKeyBase64: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF2RzZ4MCtuYmJTKzZ0TjdxZUNoNApKN1Y4MmxNQmRkSERWbFpEU1RkSG9qazIxT1hZUFE4Z1M5Z3o4UVlYVXhwRHVoOFRFN3pxZFRtcGxJeFdiakQyCmNnTitvaHY4cXNQK3daN2I3Z0Rzc2x1dUhYUGRORTRtVWYrYW05bkEyTHNOOUd5WWFGYk1VRXk2K25UR29SeVEKK2U5aDBtY1J4c1FPb3pnM3d2TlNjOGNRSERXN2hNbEZrVzZDdHVnNDNOeGZOb2ZLZzczcVYwMGpyWEQ0cS82SgpUWHBUVjVkVGt4MEUva0djQjFCeTloMkRWbUlNSmdBTHkxZGxJSXJyb0sxaU5tSDJWcmZYRER2QlFxSzN5aG1oCkc0Uy9TcUdHY05zUjJQaW5lclpveFdoQ202Rk1SMFFjWmloQVo1ajQycW1rY3g3WllmWEp6VWFSUENXSlVsdWEKandJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==',

  // 加密标识 Header 名称
  encryptionHeader: 'X-Body-Encrypted',

  // 密钥版本 Header 名称
  keyVersionHeader: 'X-Encryption-Key-Version',
};
