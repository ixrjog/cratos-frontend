加密流程：
1. 前端用随机 AES-256-GCM 密钥加密请求体
2. 用 RSA-OAEP（SHA-256）公钥加密 AES 密钥
3. 发送 {encryptedBody, encryptedKey} 到 Cloudflare Worker
4. Worker 用 RSA 私钥解密 AES 密钥 → 用 AES 密钥解密请求体 → 明文转发到源站
5. 可选：用同一个 AES 密钥加密响应返回给前端

关键设计：
- RSA 私钥存在 Cloudflare Worker 的加密环境变量里，源站不持有私钥
- 混合加密：RSA 只加密 AES 密钥（性能好），AES-GCM 加密实际数据
- AES 密文格式：Base64(IV).Base64(Ciphertext)
- 只处理 POST/PUT/PATCH/DELETE，GET 直接透传
- 非加密请求（没有 encryptedBody/encryptedKey 字段）也直接透传
- 响应加密通过 X-Response-Encryption-Required: true Header 控制

前端对应的加密逻辑在 encryption.service.ts 里，和这个 Worker 配对使用。