/**
 * Cloudflare Worker: 基于 path 的 IP 白名单网关
 *
 * 规则匹配逻辑：
 *  1. 请求路径命中某条 rule 的 paths（前缀匹配）→ 校验客户端 IP 是否在该 rule 的白名单内；
 *     - 命中白名单 → 放行回源；未命中 → 403。
 *  2. 没有命中任何 rule 的路径 → 直接放行回源。
 *
 * 客户端 IP 取自 CF-Connecting-IP（Cloudflare 边缘注入的真实客户端 IP，不可被客户端伪造）。
 */

// ===== 配置：可直接改这里，或通过 env.RULES_JSON 注入（见 wrangler.toml）=====
const DEFAULT_CONFIG = {
  rules: [
    {
      name: 'r-test-1',
      paths: [
        '/api/a/callback/',
        '/api/channel/callback/',
      ],
      // 支持 CIDR 或单个 IP（IPv4 / IPv6）
      whitelist: [
        '100.122.200.0/24',
        '220.123.200.7',
      ],
    },
  ],
};

const DENY_STATUS = 403;
const DENY_BODY = JSON.stringify({ code: 403, message: 'Access denied: The IP is not on the whitelist.' });

export default {
  async fetch(request, env, ctx) {
    const config = loadConfig(env);
    const url = new URL(request.url);
    const path = url.pathname;
    const clientIp = request.headers.get('CF-Connecting-IP') || '';

    // 找到第一条路径命中的规则
    const rule = config.rules.find(r => r.paths.some(p => pathMatches(path, p)));

    if (rule) {
      const allowed = rule.whitelist.some(entry => ipMatch(clientIp, entry));
      if (!allowed) {
        return new Response(DENY_BODY, {
          status: DENY_STATUS,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 放行：回源（保持原始请求）
    return fetch(request);
  },
};

// ===== 配置加载（优先用环境变量 RULES_JSON，便于不改代码就调整规则）=====
function loadConfig(env) {
  if (env && env.RULES_JSON) {
    try {
      const parsed = JSON.parse(env.RULES_JSON);
      if (parsed && Array.isArray(parsed.rules)) {
        return parsed;
      }
    } catch (e) {
      // 解析失败则回退到默认配置
    }
  }
  return DEFAULT_CONFIG;
}

// ===== 路径前缀匹配 =====
function pathMatches(path, prefix) {
  if (path === prefix) return true;
  if (path.startsWith(prefix)) return true;
  // 允许无尾斜杠精确命中：/api/a/callback 命中 /api/a/callback/
  if (prefix.endsWith('/') && path === prefix.slice(0, -1)) return true;
  return false;
}

// ===== IP 白名单匹配（CIDR 或单 IP）=====
function ipMatch(ip, entry) {
  if (!ip || !entry) return false;
  if (entry.includes('/')) return ipInCidr(ip, entry);
  const a = parseIp(ip);
  const b = parseIp(entry);
  return !!a && !!b && a.version === b.version && a.value === b.value;
}

function ipInCidr(ip, cidr) {
  const [net, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  const a = parseIp(ip);
  const b = parseIp(net);
  if (!a || !b || a.version !== b.version) return false;
  if (Number.isNaN(prefix) || prefix < 0 || prefix > a.bits) return false;
  const shift = BigInt(a.bits - prefix);
  return (a.value >> shift) === (b.value >> shift);
}

// 解析为 { version, value: BigInt, bits }
function parseIp(ip) {
  ip = (ip || '').trim();
  if (ip.includes(':')) {
    const v = parseIpv6(ip);
    return v === null ? null : { version: 6, value: v, bits: 128 };
  }
  const v = parseIpv4(ip);
  return v === null ? null : { version: 4, value: v, bits: 32 };
}

function parseIpv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let value = 0n;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    value = (value << 8n) + BigInt(n);
  }
  return value;
}

function parseIpv6(ip) {
  ip = ip.split('%')[0]; // 去掉 zone id
  const halves = ip.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 ? (halves[1] ? halves[1].split(':') : []) : null;
  let groups;
  if (tail === null) {
    groups = head;
    if (groups.length !== 8) return null;
  } else {
    const missing = 8 - (head.length + tail.length);
    if (missing < 0) return null;
    groups = [...head, ...Array(missing).fill('0'), ...tail];
  }
  let value = 0n;
  for (const g of groups) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    value = (value << 16n) + BigInt(parseInt(g, 16));
  }
  return value;
}
