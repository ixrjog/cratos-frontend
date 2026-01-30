# 端到端加密 HTTP Headers 说明

## 概述

前端与后端之间通过自定义 HTTP Headers 来标识和控制加密行为。所有加密相关的 Header 都以 `X-` 开头。

## Header 列表

### 1. X-Body-Encrypted

**用途**：标识请求 Body 是否已加密

**方向**：前端 → Worker/后端

**值**：
- `true` - 请求 Body 已加密
- 不存在 - 请求 Body 未加密

**示例**：
```http
POST /api/user/login HTTP/1.1
Content-Type: application/json
X-Body-Encrypted: true
X-Encryption-Key-Version: v1

{
  "encryptedBody": "base64iv.base64ciphertext",
  "encryptedKey": "base64_rsa_encrypted_aes_key"
}
```

**处理逻辑**：
- **前端**：启用加密时自动添加此 Header
- **Worker**：检测到此 Header 时进行解密，解密后**删除此 Header**再转发到后端
- **后端**：如果收到此 Header，说明 Worker 未部署或配置错误

---

### 2. X-Encryption-Key-Version

**用途**：标识使用的密钥版本，用于密钥轮换

**方向**：前端 → Worker/后端

**值**：
- `v1`, `v2`, `v3` 等版本号
- 默认：`v1`

**示例**：
```http
POST /api/user/login HTTP/1.1
X-Body-Encrypted: true
X-Encryption-Key-Version: v1
```

**处理逻辑**：
- **前端**：从配置文件读取当前密钥版本
- **Worker**：根据版本号选择对应的 RSA 私钥进行解密，解密后**删除此 Header**
- **后端**：如果收到此 Header，说明 Worker 未正确处理

**密钥轮换场景**：
```javascript
// 旧密钥
keyVersion: 'v1'
publicKey: 'old_public_key'

// 新密钥
keyVersion: 'v2'
publicKey: 'new_public_key'

// Worker 同时支持 v1 和 v2
if (keyVersion === 'v1') {
  privateKey = env.PRIVATE_KEY_V1;
} else if (keyVersion === 'v2') {
  privateKey = env.PRIVATE_KEY_V2;
}
```

---

### 3. X-Response-Encryption-Required

**用途**：告诉 Worker/后端需要加密响应数据

**方向**：前端 → Worker/后端

**值**：
- `true` - 需要加密响应
- 不存在 - 不需要加密响应

**示例**：
```http
POST /api/user/login HTTP/1.1
Content-Type: application/json
X-Body-Encrypted: true
X-Encryption-Key-Version: v1
X-Response-Encryption-Required: true
```

**处理逻辑**：
- **前端**：当 `responseEncryptionEnabled: true` 时自动添加
- **Worker**：
  1. 检测到此 Header 时，保存解密请求时的 AES 密钥
  2. 用相同的 AES 密钥加密响应数据
  3. 返回 `{encryptedData: "iv.ciphertext"}` 格式
  4. **删除此 Header**再转发到后端
- **后端**：如果收到此 Header，说明 Worker 未部署，需要自行实现响应加密

**响应格式**：
```json
// 未加密响应
{
  "success": true,
  "data": {
    "userId": 123,
    "username": "test"
  }
}

// 加密响应
{
  "encryptedData": "dGVzdGl2MTIz.ZW5jcnlwdGVkZGF0YQ=="
}
```

---

## 完整请求示例

### 场景 1：仅加密请求

```http
POST /api/user/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>
X-Body-Encrypted: true
X-Encryption-Key-Version: v1

{
  "encryptedBody": "dGVzdGl2MTIz.ZW5jcnlwdGVkYm9keQ==",
  "encryptedKey": "cnNhX2VuY3J5cHRlZF9hZXNfa2V5"
}
```

**响应**（未加密）：
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

### 场景 2：双向加密（请求和响应都加密）

**请求**：
```http
POST /api/user/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>
X-Body-Encrypted: true
X-Encryption-Key-Version: v1
X-Response-Encryption-Required: true

{
  "encryptedBody": "dGVzdGl2MTIz.ZW5jcnlwdGVkYm9keQ==",
  "encryptedKey": "cnNhX2VuY3J5cHRlZF9hZXNfa2V5"
}
```

**响应**（加密）：
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "encryptedData": "cmVzcG9uc2Vpdg==.ZW5jcnlwdGVkcmVzcG9uc2U="
}
```

前端自动解密后得到：
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

## 数据流转图

### 请求流程

```
前端                          Worker                        后端
  |                              |                            |
  | 1. 生成 AES 密钥              |                            |
  | 2. 用 AES 加密 Body           |                            |
  | 3. 用 RSA 加密 AES 密钥        |                            |
  |                              |                            |
  | POST /api/login              |                            |
  | X-Body-Encrypted: true       |                            |
  | X-Encryption-Key-Version: v1 |                            |
  | X-Response-Encryption-Required: true                      |
  | {encryptedBody, encryptedKey}|                            |
  |----------------------------->|                            |
  |                              | 4. 检测加密 Headers         |
  |                              | 5. 用 RSA 解密 AES 密钥     |
  |                              | 6. 用 AES 解密 Body         |
  |                              | 7. 删除加密 Headers         |
  |                              | 8. 保存 AES 密钥（用于响应） |
  |                              |                            |
  |                              | POST /api/login            |
  |                              | (无加密 Headers)            |
  |                              | {username, password}       |
  |                              |--------------------------->|
  |                              |                            | 9. 处理业务逻辑
  |                              |                            |
```

### 响应流程

```
后端                          Worker                        前端
  |                              |                            |
  | 10. 返回明文响应              |                            |
  | {success: true, data: {...}} |                            |
  |<-----------------------------|                            |
  |                              | 11. 检查是否需要加密响应     |
  |                              | 12. 用缓存的 AES 密钥加密    |
  |                              | 13. 返回加密响应            |
  |                              |                            |
  |                              | {encryptedData: "..."}     |
  |                              |--------------------------->|
  |                              |                            | 14. 用缓存的 AES 密钥解密
  |                              |                            | 15. 得到原始响应
  |                              |                            | 16. 清除 AES 密钥缓存
```

---

## 安全特性

### 1. 密钥隔离
- **前端**：只有 RSA 公钥
- **Worker**：有 RSA 私钥
- **后端**：无需密钥（Worker 已解密）

### 2. 密钥生命周期
- 每次请求生成新的 AES 密钥
- AES 密钥仅在内存中缓存
- 响应解密后立即清除

### 3. 防重放攻击
- 每次请求使用不同的 AES 密钥
- 每次加密使用随机 IV

### 4. 密钥轮换
- 通过 `X-Encryption-Key-Version` 支持多版本密钥
- 可以平滑过渡到新密钥

---

## 配置示例

### 前端配置

```typescript
// encryption.config.ts
export const EncryptionConfig = {
  enabled: true,                      // 启用请求加密
  responseEncryptionEnabled: true,    // 启用响应加密
  keyVersion: 'v1',                   // 密钥版本
  publicKeyBase64: 'LS0tLS1...',      // RSA 公钥
  encryptionHeader: 'X-Body-Encrypted',
  keyVersionHeader: 'X-Encryption-Key-Version',
  responseEncryptionHeader: 'X-Response-Encryption-Required',
};
```

### Worker 配置

```javascript
// wrangler.toml
name = "encryption-worker"
main = "worker.js"

# 环境变量（通过 wrangler secret 设置）
# PRIVATE_KEY_PEM - RSA 私钥
```

### 后端配置（可选，如果不使用 Worker）

```java
// application.yml
encryption:
  enabled: true
  key-version: v1
  private-key-path: /path/to/private_key.pem
```

---

## 故障排查

### 问题 1：后端收到加密的请求

**现象**：后端日志显示收到 `{encryptedBody, encryptedKey}`

**原因**：Worker 未部署或未正确配置路由

**解决**：
1. 检查 Worker 是否部署：`wrangler tail`
2. 检查路由配置：Cloudflare Dashboard → Workers Routes
3. 检查私钥是否配置：`wrangler secret list`

---

### 问题 2：前端解密失败

**现象**：控制台报错 "Response decryption failed"

**原因**：
1. 后端未加密响应
2. 后端使用了不同的 AES 密钥

**解决**：
1. 检查后端是否收到 `X-Response-Encryption-Required` Header
2. 确认后端使用请求中的 AES 密钥（不是新生成的）
3. 检查响应格式是否为 `{encryptedData: "..."}`

---

### 问题 3：拦截器报错 "something error"

**现象**：拦截器抛出错误

**原因**：拦截器检查 `success` 字段，但加密响应没有此字段

**解决**：拦截器需要跳过加密响应的检查：
```typescript
if (result && result.encryptedData) {
  return of(event);  // 直接返回，不检查 success
}
```

---

## 总结

| Header | 方向 | 用途 | Worker 处理 |
|--------|------|------|------------|
| X-Body-Encrypted | 前端→后端 | 标识请求已加密 | 解密后删除 |
| X-Encryption-Key-Version | 前端→后端 | 密钥版本 | 解密后删除 |
| X-Response-Encryption-Required | 前端→后端 | 要求加密响应 | 加密响应后删除 |

**关键点**：
- Worker 解密请求后会**删除所有加密 Headers**
- 后端收到的是**明文请求**，无需关心加密逻辑
- 响应加密使用**相同的 AES 密钥**
- 每次请求使用**不同的 AES 密钥**
