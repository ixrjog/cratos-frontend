# Worker 部署步骤

## 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

## 2. 登录 Cloudflare

```bash
wrangler login
```

## 3. 配置私钥（重要！）

```bash
cd clourflare-worker
wrangler secret put PRIVATE_KEY_PEM
```

然后粘贴私钥内容（包含 BEGIN 和 END 行）：

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8brHT6dttL7q0
...（完整私钥内容）...
9BVzd6Hx4zuXv73H7gBN9Dc=
-----END PRIVATE KEY-----
```

按 Ctrl+D 结束输入。

## 4. 部署 Worker

```bash
wrangler deploy
```

## 5. 配置路由

在 Cloudflare Dashboard 中：

1. 进入你的域名
2. 点击 "Workers Routes"
3. 添加路由：
   - Route: `api.yourdomain.com/*`
   - Worker: `cratos-encryption-worker`

## 6. 测试

```bash
# 测试请求
curl -X POST https://api.yourdomain.com/test \
  -H "Content-Type: application/json" \
  -H "X-Body-Encrypted: true" \
  -H "X-Response-Encryption-Required: true" \
  -d '{"encryptedBody":"...","encryptedKey":"..."}'
```

## 本地测试

```bash
# 本地开发模式
wrangler dev

# 设置本地环境变量
wrangler secret put PRIVATE_KEY_PEM --env local
```

## 更新代码

只需要重新部署：

```bash
wrangler deploy
```

**注意**：私钥只需要设置一次，除非需要更换密钥。

## 查看日志

```bash
wrangler tail
```

## 删除 Worker

```bash
wrangler delete
```

## 常见问题

### Q: 私钥设置后如何查看？
A: 无法直接查看，只能重新设置。建议备份私钥到安全位置。

### Q: 如何更换密钥？
A: 重新运行 `wrangler secret put PRIVATE_KEY_PEM` 即可覆盖。

### Q: 部署后多久生效？
A: 通常 1-2 分钟内全球生效。
