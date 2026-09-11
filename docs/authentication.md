# Cratos 前端认证方案

> 本文描述 Cratos 前端（cratos-web，Angular 15.2）与后端（cratos，Spring Security + 自研 filter）之间的认证与请求签名机制，以及 Jti HttpOnly Cookie 化的改造。

## 1. 凭证模型

登录成功后系统持有三样东西：

| 凭证 | 含义 | 存储位置 | 是否上报文 | XSS 可读 |
|---|---|---|---|---|
| `token` | JWT，作为请求签名的 **HMAC 密钥** | 前端 localStorage（key 名 `id_token`）；后端 DB `user_token` 表 | 签名模式下**从不传输** | ⚠️ 是（localStorage） |
| `Jti` | 随机 UUID，用于后端查库定位对应的 token | **HttpOnly Cookie**（改造后）；后端 DB `user_token.jti`（有索引） | 由 Cookie 自动携带 | 否（HttpOnly） |
| `id_token` | —— | 它只是前端给 `token` 起的 localStorage key 名，**后端无此概念** | —— | —— |

关键设计：**持有凭证（token）与标识（Jti）分离**。`token` 只当签名密钥、不上网；`Jti` 只做标识、经 Cookie 传输。即使拿到其一也无法独立冒用。

## 2. 认证流程

### 2.1 登录

- 密码登录：`POST /api/log/login` → `LogController.login`
- LDAP 登录：同上，走 `LdapAuthProvider`
- 生物识别(WebAuthn)：`POST /api/webauthn/login/complete` → `WebAuthnController.completeLogin`（**独立路径，不经过 LogController**）

后端签发：随机生成 `jti` → 落库 `user_token`（含 `token`、`jti`、`expiredTime`、`valid`）→
- 将 `Jti` 写入 **HttpOnly Cookie** 下发；
- 响应体返回 `token`（前端存为 `id_token`）+ `jti`（灰度期保留，稳定后可移除）。

### 2.2 每次业务请求（签名模式）

前端拦截器 `default.interceptor.ts` 对 `/api` 请求：

1. `withCredentials: true` → 浏览器自动携带 HttpOnly 的 `Jti` Cookie；
2. 从 localStorage 读 `token`（HMAC 密钥），生成签名头：
   - `Timestamp`：当前毫秒时间戳
   - `Jwt-Sign`：`HMAC-SHA256(Timestamp + bodyHash, key=token)`，其中 `bodyHash = SHA-256(encryptedBody)`（无加密体时为空）
3. 删除 `Authorization` 头（签名模式不用 Bearer）。

后端 `AuthenticationTokenFilter.verifyByRequestSign`：

1. 从 **Cookie 读 `Jti`**（回退 header，灰度兼容旧前端）；
2. 校验 `Timestamp` 在 ±30s 窗口内（防重放）；
3. 用 `Jti` 查库拿 `token`，校验 `valid`；
4. 用 `token` 作密钥重算 `HMAC-SHA256(Timestamp + bodyHash)` 与 `Jwt-Sign` 比对。

> **签名不含 Jti**：因为 Jti 已 HttpOnly、前端 JS 读不到；签名内容为 `Timestamp + bodyHash`，密钥仍为 `token`，签名强度不变（Jti 本就是明文标识而非密钥）。

### 2.3 登出

`PUT /api/log/logout` → 后端把该用户所有 `user_token` 置 `valid=false`，并下发 `Max-Age=0` 的 `Jti` Cookie 清除；前端清理 localStorage（`id_token` 等）。

## 3. Token 有效期

由 `UserTokenFacadeImpl.resolveTokenValidity` 决定，**Cookie Max-Age 跟随 token 有效期**（登录时按签发 token 的 `expiredTime` 推算，避免 Cookie 与 token 时效错位）：

| 登录方式 | token 有效期 | Jti Cookie Max-Age |
|---|---|---|
| 密码 / LDAP | 24 小时 | 24 小时 |
| 生物识别 (WebAuthn) | 15 天 | 15 天 |

## 4. Jti Cookie 属性

```
Set-Cookie: Jti=<uuid>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=<跟随token>
```

- `HttpOnly`：JS 读不到，防 XSS 窃取（核心目的）
- `Secure`：仅 HTTPS 传输
- `SameSite=Strict`：防 CSRF（跨站请求不携带）
- `Path=/`：HTTP 接口在 `/api`、WebSocket 握手在 `/socket`，两者都需携带 Jti；且 HttpOnly 后前端 JS 读不到 jti、无法再放进 WS query，故 Cookie 必须覆盖 `/socket`

跨域（前后端分离）部署时：需配置 `cratos.cors.allowed-origins`（精确来源，不可用 `*`），后端启用 `allowCredentials(true)`，Cookie 需 `SameSite=None; Secure`。同源部署（前端打包进后端 `static/`）无需 CORS。

## 5. WebSocket

握手 URL 携带 `?t=<timestamp>&sign=<HMAC-SHA256(timestamp, token)>`；`Jti` 由浏览器在同域握手时通过 Cookie 自动携带（Cookie `Path=/` 覆盖 `/socket`）。

后端 `MyServerEndpointConfigConfig.modifyHandshake` 从握手请求的 `Cookie` header 解析 `Jti`（回退 query `jti` 灰度兼容），签名校验同时接受新公式 `HMAC(timestamp)` 与旧公式 `HMAC(jti+timestamp)`。此 configurator 覆盖全部 `/socket/*` 端点（pod exec / 容器详情 / web-terminal 等）。

## 6. 安全边界与后续加固

本方案已完成的：**Jti HttpOnly 化**，杜绝「XSS 读走 Jti 后异地重放」。

**尚未闭环**（XSS 面仍在）：

1. **`token` 仍在 localStorage，XSS 可读**。攻击者即使读不到 HttpOnly 的 Jti，也能在受害者页面上下文中直接发请求（浏览器自动带 Jti Cookie），并用读到的 `token` 就地签名。**这是当前最大的残留风险。**
2. 根治手段是**全站 CSP**（限制脚本来源、拦截 XSS 执行）+ **`token` 移出 localStorage**（内存化，刷新靠重新下发）。

### 关于 refresh token

refresh token 解决的是「短 access 时效 vs 免登体验」的矛盾，**不提升抗 XSS 能力**。以当前「密码 24h / 生物 15 天」的时效，属于可选增强，非必需。仅当需要「缩短 access 到分钟级」或「关浏览器长期免登」时才引入。

## 7. 涉及的关键文件

### 前端 (cratos-web)
| 文件 | 作用 |
|---|---|
| `src/app/@core/services/default.interceptor.ts` | HTTP 拦截器：`withCredentials` + 注入签名头 |
| `src/app/@core/services/request-sign.service.ts` | HMAC-SHA256 签名（Timestamp + bodyHash） |
| `src/app/@core/services/log.service.ts` | 登录/登出、setSession（存 `id_token`，不存 jti） |
| `src/app/@core/services/ws.api.service.ts` | WebSocket 签名 |
| `src/app/@shared/components/login/login.component.ts` | 登录组件（密码 + WebAuthn） |

### 后端 (cratos)
| 文件 | 作用 |
|---|---|
| `.../facade/auth/filter/AuthenticationTokenFilter.java` | 鉴权 filter：从 Cookie 读 Jti + 验签 |
| `.../controller/http/LogController.java` | 密码/LDAP 登录登出，下发/清除 Jti Cookie |
| `.../controller/http/WebAuthnController.java` | 生物识别登录，下发 Jti Cookie |
| `.../facade/auth/util/JtiCookieUtil.java` | Jti Cookie 统一构造 |
| `.../facade/auth/impl/LocalAuthProvider.java` / `LdapAuthProvider.java` | 登录响应装配 maxAge |
| `.../facade/impl/UserTokenFacadeImpl.java` | Jti 签发、token 有效期 |
| `.../configuration/WebSecurityConfig.java` | Spring Security + 按配置启用的 CORS |
| `.../common/util/RequestSignUtil.java` | HMAC 校验、时间戳窗口 (±30s) |
