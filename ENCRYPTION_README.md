# Body 加密功能使用说明

## 功能概述

前端使用混合加密（RSA + AES）对 POST/PUT/DELETE 请求的 Body 进行加密。

## 加密流程

1. 前端生成随机 AES-256 密钥
2. 使用 AES-GCM 加密 Body
3. 使用 RSA 公钥加密 AES 密钥
4. 发送 `{encryptedBody, encryptedKey}` 到服务端
5. 服务端通过 Header 识别加密请求和密钥版本

## 配置文件

### 1. 加密配置 (`encryption.config.ts`)

```typescript
export const EncryptionConfig = {
  // 是否启用加密（默认关闭）
  enabled: false,

  // 密钥版本（用于密钥轮换）
  keyVersion: 'v1',

  // RSA 公钥
  publicKey: `-----BEGIN PUBLIC KEY-----
  ...
  -----END PUBLIC KEY-----`,

  // 加密标识 Header
  encryptionHeader: 'X-Body-Encrypted',

  // 密钥版本 Header
  keyVersionHeader: 'X-Encryption-Key-Version',
};
```

## 启用加密

### 方式 1: 修改配置文件（推荐）

编辑 `src/app/@core/config/encryption.config.ts`:

```typescript
export const EncryptionConfig = {
  enabled: true,  // 改为 true
  // ...
};
```

### 方式 2: 运行时动态开关

```typescript
import { EncryptionConfig } from '@core/config/encryption.config';

// 启用加密
EncryptionConfig.enabled = true;

// 关闭加密
EncryptionConfig.enabled = false;
```

## HTTP Headers

加密请求会自动添加以下 Headers:

```
X-Body-Encrypted: true
X-Encryption-Key-Version: v1
Content-Type: application/json
Authorization: Bearer <token>
```

## 请求格式

### 未加密（enabled: false）

```json
{
  "username": "test",
  "password": "123456"
}
```

### 已加密（enabled: true）

```json
{
  "encryptedBody": "base64iv.base64ciphertext",
  "encryptedKey": "base64_rsa_encrypted_aes_key"
}
```

## 服务端解密

服务端需要：

1. 检查 `X-Body-Encrypted` Header
2. 获取 `X-Encryption-Key-Version` 确定密钥版本
3. 使用对应版本的 RSA 私钥解密 `encryptedKey`
4. 使用解密后的 AES 密钥解密 `encryptedBody`

## 密钥轮换

当需要更换密钥时：

1. 生成新的 RSA 密钥对
2. 更新 `publicKey` 和 `keyVersion`（如 'v2'）
3. 服务端同时支持 v1 和 v2 私钥
4. 逐步迁移后移除旧密钥

## 注意事项

1. ✅ GET 请求不加密（无 Body）
2. ✅ 加密仅影响 POST/PUT/DELETE 的 Body
3. ✅ Headers 和 URL 参数不加密
4. ⚠️ 启用加密后，服务端必须支持解密
5. ⚠️ 公钥可以公开，私钥必须保密

## 测试

```typescript
// 测试加密功能
import { ApiService } from '@core/services/api.service';

constructor(private apiService: ApiService) {}

testEncryption() {
  const data = { username: 'test', password: '123456' };
  
  this.apiService.post('/auth', '/login', data).subscribe(
    response => console.log('Success:', response),
    error => console.error('Error:', error)
  );
}
```

## 性能影响

- 加密耗时: ~5-10ms
- 对用户体验影响: 可忽略
- 网络传输: 增加约 30% 大小（Base64 编码）

## 安全性

- ✅ 每次请求使用不同的 AES 密钥（防重放攻击）
- ✅ AES-GCM 提供认证加密
- ✅ RSA-OAEP 安全填充
- ✅ 即使 HTTPS 被破解，Body 仍然安全
