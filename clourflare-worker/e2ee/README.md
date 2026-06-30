# Cloudflare Worker 加密配置说明

## 功能概述

Cloudflare Worker 作为边缘代理，负责：
1. 解密前端发送的加密请求
2. 转发解密后的请求到源站
3. 加密源站返回的响应数据（可选）
4. 返回加密响应给前端

## 部署步骤

### 1. 配置环境变量

在 Cloudflare Worker 设置中添加环境变量：

```
PRIVATE_KEY_PEM = -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8brHT6dttL7q0
3up4KHgntXzaUwF10cNWVkNJN0eiOTbU5dg9DyBL2DPxBhdTGkO6HxMTvOp1OamU
jFZuMPZyA36iG/yqw/7BntvuAOyyW64dc900TiZR/5qb2cDYuw30bJhoVsxQTLr6
dMahHJD572HSZxHGxA6jODfC81JzxxAcNbuEyUWRboK26Djc3F82h8qDvepXTSOt
cPir/olNelNXl1OTHQT+QZwHUHL2HYNWYgwmAAvLV2UgiuugrWI2YfZWt9cMO8FC
orfKGaEbhL9KoYZw2xHY+Kd6tmjFaEKboUxHRBxmKEBnmPjaqaRzHtlh9cnNRpE8
JYlSW5qPAgMBAAECggEAQhVwOCmj0r8Sc6xZ/pnyybpUdxz1PiS6pOTL5DmG3dXC
7RdOpttPMEo6rSS9uV9UsUmEnz952nLGjlpJVYvGYmXnW2MFUb468hyMdQPN/x84
CQxBX76ooclKp63OfDPdyQLs0GrgbKj8Sin6HzatgXn6jJepHFRV7dghdjVvjTqA
0QwwQCjfwjt3BsTUNOPI12Q2yNmsQakiltc85RDS1iy19i8gXU5KxaIChO1aqWOc
6TZcjOyBdPNPG0dkPqcFUZlT3wTAAP/rrpC0FNpUBUiriuTOSzdVTFYHiqFIVucn
IeaNluxcbPp7rFIj+84AozjEyKAIknkguYXSa3lMQQKBgQDfJlglQ+snmycgeode
YTT6O8d6nfxxRUdwXuNXcJ4jz7gOqIQo5QLTC33xagnan2Fe08NaG6fqi9hT6vDA
P5F0nlvSxjcObPXbEvs/gxp4HGTtrGWELktgPwFWsfS6abCZ8MHUdZVw13hjdF+l
W3X/BQrWQHCmgAkbAfUutEnMpQKBgQDYK/xnKEMTDnrIl9jBmnwGfglPTnMXpBhd
f6FHz6xnjUSsMTOHNhecNRg50ZUDMLTEC1w/agghlpaijl4073aX3hNxnfN5KkdF
0CxivbPyBdgUaFJcbzrFQLwEadmeDMaPtMoWohQI7MtjsN1drYOz2fgfRdJKNn/P
TaFLuPAgIwKBgDuAWvKc2KA388fqRBw7aUfsFrWwWLbPVUw2UQJoyhIceiSWdJ7+
6bDimJN9xeDgrLL/XlCxnSWiYm2F8OoiSSPCchOSvO2AylG/DvWRfMZYM+VYGb2U
Jo8kXbQDQZFPS0LQ+q4vKEjte3Fxf2t1JtJ4Qrp8dk0/SK5F6F2qvx7tAoGAOtdm
QfIcp+BGHbnvf2t8nQvLnvG8tE+vbivii7iEtj8m1TQjUYewz41IRdy9kfu9CKwK
9Rv4kKP75s2X6RLRli8V3dRfxLh0ZBVxL4Nxqsxab9uhp5WDStP/GbhySuoxVkag
x55gk7lY947aArjLY7ZOKr0Hq7m/+n6oDAOQIT8CgYEAqH55bDboCfsHYTIg9lpd
MzkkHeHNWfuo9dgR5u+IxhpKnTca/+tc8kj76UtGXWJA3Kj+27+WgWfw4h71iuVH
1kXYvRTTH0s/yJUUiy9LGcFNioc9I2rrs1pGZhPppliWDGr3ae4nrOkLjm9otszk
9BVzd6Hx4zuXv73H7gBN9Dc=
-----END PRIVATE KEY-----
```

⚠️ **重要**：这是敏感信息，必须使用 Cloudflare 的加密环境变量功能。

### 2. 部署 Worker

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler deploy
```

### 3. 配置路由

在 Cloudflare Dashboard 中：
1. 进入你的域名设置
2. 添加 Worker 路由：`api.yourdomain.com/*`
3. 选择刚部署的 Worker

## 工作流程

### 请求解密流程

```
前端                    Cloudflare Worker              源站
  |                            |                        |
  | 1. 加密请求                 |                        |
  |    {encryptedBody,         |                        |
  |     encryptedKey}          |                        |
  |--------------------------->|                        |
  |                            | 2. 用 RSA 解密 AES 密钥 |
  |                            |                        |
  |                            | 3. 用 AES 解密 Body     |
  |                            |                        |
  |                            | 4. 转发明文请求         |
  |                            |----------------------->|
  |                            |                        | 5. 处理请求
  |                            |<-----------------------|
  |<---------------------------|                        |
  | 6. 返回响应                 |                        |
```

### 响应加密流程（可选）

```
前端                    Cloudflare Worker              源站
  |                            |                        |
  | 1. 加密请求 + Header        |                        |
  |    X-Response-Encryption-  |                        |
  |    Required: true          |                        |
  |--------------------------->|                        |
  |                            | 2. 解密请求             |
  |                            |                        |
  |                            | 3. 保存 AES 密钥        |
  |                            |                        |
  |                            | 4. 转发请求             |
  |                            |----------------------->|
  |                            |                        | 5. 处理请求
  |                            | 6. 返回明文响应         |
  |                            |<-----------------------|
  |                            | 7. 用 AES 加密响应      |
  |                            |                        |
  | 8. 返回加密响应             |                        |
  |    {encryptedData}         |                        |
  |<---------------------------|                        |
  | 9. 前端解密                 |                        |
```

## 支持的请求方法

- POST
- PUT
- PATCH
- DELETE

GET 请求直接透传，不做处理。

## 请求格式

### 加密请求

```json
{
  "encryptedBody": "base64iv.base64ciphertext",
  "encryptedKey": "base64_rsa_encrypted_aes_key"
}
```

### Headers

```
Content-Type: application/json
X-Body-Encrypted: true
X-Encryption-Key-Version: v1
X-Response-Encryption-Required: true  // 可选，需要加密响应时添加
```

## 响应格式

### 未加密响应（默认）

Worker 直接返回源站的响应。

### 加密响应（当 X-Response-Encryption-Required: true）

```json
{
  "encryptedData": "base64iv.base64ciphertext"
}
```

## 错误处理

### 私钥未配置

```json
{
  "error": "Private key not configured"
}
```
HTTP Status: 500

### 解密失败

```json
{
  "error": "Processing failed",
  "message": "详细错误信息"
}
```
HTTP Status: 400

## 性能考虑

- 解密耗时：~5-10ms
- 加密耗时：~3-5ms
- 总延迟增加：~8-15ms
- 对用户体验影响：可忽略

## 安全性

### 优势

1. ✅ 私钥存储在 Cloudflare 边缘，不在源站
2. ✅ 即使源站被攻击，攻击者也无法解密历史请求
3. ✅ 利用 Cloudflare 全球边缘网络，就近解密
4. ✅ 减轻源站解密负担

### 注意事项

1. ⚠️ 私钥必须使用 Cloudflare 加密环境变量
2. ⚠️ 定期轮换密钥（建议每 6-12 个月）
3. ⚠️ 监控 Worker 日志，及时发现异常
4. ⚠️ 限制 Worker 的访问权限

## 监控与日志

### 查看日志

```bash
wrangler tail
```

### 关键指标

- 请求成功率
- 解密失败次数
- 平均响应时间
- 错误类型分布

## 故障排查

### 解密失败

1. 检查私钥是否正确配置
2. 确认前端使用的公钥与私钥匹配
3. 检查加密数据格式是否正确

### 响应加密失败

1. 确认源站返回的是 JSON 格式
2. 检查 AES 密钥是否正确保存
3. 查看 Worker 日志获取详细错误

## 测试

### 本地测试

```bash
# 使用 Wrangler 本地开发
wrangler dev

# 设置环境变量
export PRIVATE_KEY_PEM="..."
```

### 生产测试

```bash
# 发送测试请求
curl -X POST https://api.yourdomain.com/test \
  -H "Content-Type: application/json" \
  -H "X-Body-Encrypted: true" \
  -H "X-Response-Encryption-Required: true" \
  -d '{"encryptedBody":"...","encryptedKey":"..."}'
```

## 成本估算

Cloudflare Workers 定价：
- 免费额度：100,000 请求/天
- 付费：$5/月 + $0.50/百万请求

对于大多数应用，免费额度足够使用。

## 备份与恢复

### 备份私钥

```bash
# 导出环境变量（安全存储）
wrangler secret list
```

### 恢复

```bash
# 重新设置私钥
wrangler secret put PRIVATE_KEY_PEM
```

## 版本管理

建议使用 Git 管理 Worker 代码，但**不要提交私钥**。

```gitignore
# .gitignore
.env
wrangler.toml  # 如果包含敏感信息
```

## 总结

Cloudflare Worker 提供了一个高性能、低成本的加密代理方案：

- ✅ 边缘计算，全球加速
- ✅ 自动扩展，无需运维
- ✅ 安全隔离，私钥不在源站
- ✅ 成本低廉，免费额度充足
- ✅ 支持双向加密，灵活配置
