# callback-ip-gate (Cloudflare Worker)

基于 path 列表 + IP 白名单的访问控制网关。

## 行为

- 请求路径命中某条 `rule.paths`（前缀匹配）→ 校验 `CF-Connecting-IP` 是否在该 rule 的 `whitelist` 内：
  - 命中 → 放行回源；
  - 未命中 → 返回 `403 {"code":403,"message":"Access denied"}`。
- 未命中任何规则的路径 → 直接放行回源。

客户端 IP 取自 `CF-Connecting-IP`（Cloudflare 注入的真实客户端 IP，不可伪造），优于 `X-Forwarded-For`。

## 白名单格式

`whitelist` 每项可为：

- CIDR：`100.122.200.0/24`（IPv4），`2400:cb00::/32`（IPv6）
- 单个 IP：`220.123.200.7`、`2606:4700::1111`

IPv4 / IPv6 均支持。

## 配置规则

两种方式（任选其一）：

1. 直接改 `worker.js` 里的 `DEFAULT_CONFIG`。
2. 通过环境变量 `RULES_JSON`（wrangler.toml 的 `[vars]` 或 Dashboard）注入 JSON，改规则不用动代码。

### YAML -> RULES_JSON

`rules.yaml` 是给人看的参考格式。转成 wrangler 用的 JSON：

```bash
# 需要 npx / node
npx js-yaml rules.yaml | python3 -c "import sys,json;print(json.dumps(json.load(sys.stdin)))"
```

把输出填到 `wrangler.toml`：

```toml
[vars]
RULES_JSON = '{"rules":[{"name":"r-test-1","paths":["/api/a/callback/","/api/channel/callback/"],"whitelist":["100.122.200.0/24","220.123.200.7"]}]}'
```

## 部署

```bash
# 安装 wrangler（如未安装）
npm i -g wrangler

# 本地调试
wrangler dev

# 部署
wrangler deploy
```

部署前在 `wrangler.toml` 配置 `routes`，把要保护的域名/路径挂到本 worker。

## 调试

```bash
wrangler tail   # 实时日志
```
