/**
 * Body 加密配置
 */
export const EncryptionConfig = {
  // 是否启用加密
  enabled: true,

  // 密钥版本（用于密钥轮换）
  keyVersion: 'v1',

  // RSA 公钥（Base64 格式）
  publicKeyBase64: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF4SmN1ak9wRGZkNWd0YzhXdHArdwpvUGR1NkZ3bmxIK2Qxa0FYOTZHdUFUNG1yTU1wZlNmc2RBb1d5V0xCWVpDTVpUSDk1d3JPZmYvdFVwRHNBOUo5CjNJYlZZcVpSTWVLRU5wTnJsK0E5OTlzZkQzaW9YNHRUbVdPQVVvaGJkcnlIeXFjaFF0RTg0TDNWdDhpNzllOTkKRy8yc1gzOUQ5bnJWM3M1RWp3eC9UMTYyWXVvaDkyN0w2ZGVlMzBmb0hFRWtrUWRRWTVYNnRTajN6M24rbDh6ZgpnOTg4UnI0Q1JQY2pZQWJwWmROUmtjRjBtTnV2YmdQekIzclBDNUMzOHMvMzZyK0dkUTFqbkxQY0F1OEFKeStPCnlrUjRPRWJNVThFeWF3eTJaeS95OXpGTWVBT2FyekxFdHBvdjZjVTlDUVZwWVQveFNpbTNhd3hVVmk5QUgyQ1kKQndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t',

  // 加密标识 Header 名称
  encryptionHeader: 'X-Body-Encrypted',

  // 密钥版本 Header 名称
  keyVersionHeader: 'X-Encryption-Key-Version',
};
