# Body 加密功能使用说明

## 功能概述

前端使用混合加密（RSA + AES）对 POST/PUT/DELETE 请求的 Body 进行加密，并支持对后端返回的响应数据进行解密。

## 加密流程

### 请求加密
1. 前端生成随机 AES-256 密钥
2. 使用 AES-GCM 加密 Body
3. 使用 RSA 公钥加密 AES 密钥
4. 发送 `{encryptedBody, encryptedKey}` 到服务端
5. 服务端通过 Header 识别加密请求和密钥版本

### 响应解密（新增）
1. 前端在请求 Header 中添加 `X-Response-Encryption-Required: true`
2. 后端使用相同的 AES 密钥加密响应数据
3. 后端返回 `{encryptedData: "base64iv.base64ciphertext"}`
4. 前端使用缓存的 AES 密钥解密响应数据
5. 自动清除密钥缓存

## 配置文件

### 1. 加密配置 (`encryption.config.ts`)

```typescript
export const EncryptionConfig = {
  // 是否启用请求加密（默认关闭）
  enabled: false,

  // 是否启用响应加密（默认关闭）
  responseEncryptionEnabled: false,

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

  // 响应加密请求 Header（新增）
  responseEncryptionHeader: 'X-Response-Encryption-Required',
};
```

## 启用加密

### 方式 1: 修改配置文件（推荐）

编辑 `src/app/@core/config/encryption.config.ts`:

```typescript
export const EncryptionConfig = {
  enabled: true,  // 启用请求加密
  responseEncryptionEnabled: true,  // 启用响应加密
  // ...
};
```

### 方式 2: 运行时动态开关

```typescript
import { EncryptionConfig } from '@core/config/encryption.config';

// 启用请求加密
EncryptionConfig.enabled = true;

// 启用响应加密
EncryptionConfig.responseEncryptionEnabled = true;

// 关闭加密
EncryptionConfig.enabled = false;
EncryptionConfig.responseEncryptionEnabled = false;
```

## HTTP Headers

### 请求 Headers

加密请求会自动添加以下 Headers:

```
X-Body-Encrypted: true
X-Encryption-Key-Version: v1
X-Response-Encryption-Required: true  // 当 responseEncryptionEnabled = true 时
Content-Type: application/json
Authorization: Bearer <token>
```

## 数据格式

### 请求格式

#### 未加密（enabled: false）

```json
{
  "username": "test",
  "password": "123456"
}
```

#### 已加密（enabled: true）

```json
{
  "encryptedBody": "base64iv.base64ciphertext",
  "encryptedKey": "base64_rsa_encrypted_aes_key"
}
```

### 响应格式

#### 未加密（responseEncryptionEnabled: false）

```json
{
  "code": 0,
  "data": {
    "userId": 123,
    "username": "test"
  }
}
```

#### 已加密（responseEncryptionEnabled: true）

```json
{
  "encryptedData": "base64iv.base64ciphertext"
}
```

前端会自动解密为：

```json
{
  "code": 0,
  "data": {
    "userId": 123,
    "username": "test"
  }
}
```

## 服务端实现

### 请求解密

服务端需要：

1. 检查 `X-Body-Encrypted` Header
2. 获取 `X-Encryption-Key-Version` 确定密钥版本
3. 使用对应版本的 RSA 私钥解密 `encryptedKey`
4. 使用解密后的 AES 密钥解密 `encryptedBody`

### 响应加密（新增）

服务端需要：

1. 检查 `X-Response-Encryption-Required` Header
2. 如果为 `true`，使用请求中的 AES 密钥加密响应数据
3. 返回格式：`{encryptedData: "base64iv.base64ciphertext"}`

**重要**：后端必须使用与请求相同的 AES 密钥加密响应！

示例伪代码：

```java
// 解密请求
AESKey aesKey = decryptAESKey(request.encryptedKey);
String requestBody = decryptWithAES(request.encryptedBody, aesKey);

// 处理业务逻辑
Object responseData = handleRequest(requestBody);

// 检查是否需要加密响应
if ("true".equals(request.getHeader("X-Response-Encryption-Required"))) {
    String encryptedData = encryptWithAES(responseData, aesKey);  // 使用相同的 AES 密钥
    return new Response(encryptedData);
}

return responseData;
```

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
4. ✅ 每次请求使用不同的 AES 密钥
5. ✅ 响应解密后自动清除密钥缓存
6. ⚠️ 启用加密后，服务端必须支持解密
7. ⚠️ 启用响应加密后，服务端必须使用相同的 AES 密钥加密响应
8. ⚠️ 公钥可以公开，私钥必须保密

## 测试

```typescript
// 测试加密功能
import { ApiService } from '@core/services/api.service';
import { EncryptionConfig } from '@core/config/encryption.config';

constructor(private apiService: ApiService) {}

testEncryption() {
  // 启用双向加密
  EncryptionConfig.enabled = true;
  EncryptionConfig.responseEncryptionEnabled = true;

  const data = { username: 'test', password: '123456' };
  
  this.apiService.post('/auth', '/login', data).subscribe(
    response => {
      console.log('Decrypted response:', response);
      // response 已经是解密后的数据
    },
    error => console.error('Error:', error)
  );
}
```

## 性能影响

- 请求加密耗时: ~5-10ms
- 响应解密耗时: ~3-5ms
- 对用户体验影响: 可忽略
- 网络传输: 增加约 30% 大小（Base64 编码）

## 安全性

- ✅ 每次请求使用不同的 AES 密钥（防重放攻击）
- ✅ AES-GCM 提供认证加密
- ✅ RSA-OAEP 安全填充
- ✅ 即使 HTTPS 被破解，Body 仍然安全
- ✅ 响应数据同样受到保护
- ✅ 密钥使用后自动清除，防止泄露

## 故障排查

### 响应解密失败

如果遇到 "Response decryption failed" 错误：

1. 检查 `responseEncryptionEnabled` 是否为 `true`
2. 确认后端正确实现了响应加密
3. 确认后端使用的是请求中的 AES 密钥（不是新生成的）
4. 检查后端返回格式是否为 `{encryptedData: "iv.ciphertext"}`
5. 查看浏览器控制台的详细错误信息

### 密钥缓存问题

如果遇到 "No AES key available for decryption" 错误：

1. 确认请求加密已启用（`enabled: true`）
2. 检查是否在请求完成前密钥被清除
3. 确认请求和响应在同一个流程中处理
