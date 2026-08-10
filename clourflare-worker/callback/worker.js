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

// ===== 配置：可直接改这里，或通过 env.CF_CALLBACK_PK_RULES_CONFIG 注入（见 wrangler.toml）=====
// DEFAULT_CONFIG 仅作「兜底」：当变量 CF_CALLBACK_PK_RULES_CONFIG 缺失/解析失败时使用。
// 实际规则请放到 Cloudflare 变量 CF_CALLBACK_PK_RULES_CONFIG（见 loadConfig / wrangler.toml）。
// 注意：env 只能在 fetch(request, env, ctx) 里访问，不能在模块顶层引用。
const DEFAULT_CONFIG = {
  rules: []
};

const DENY_STATUS = 403;
const denyBody = (ip) => JSON.stringify({ code: 403, message: `Access denied: IP ${ip} is not on the whitelist.` });

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
        return new Response(denyBody(clientIp), {
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
  // 优先读 CF_CALLBACK_PK_RULES_CONFIG（Cloudflare 变量/机密），兼容旧的 RULES_JSON。
  const raw = env && (env.CF_CALLBACK_PK_RULES_CONFIG || env.RULES_JSON);
  if (raw) {
    try {
      // 变量值通常是 JSON 字符串；若平台已解析成对象则直接用。
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      // 支持两种形态：{ "rules": [...] } 或直接一个 [...] 数组。
      if (Array.isArray(parsed)) return { rules: parsed };
      if (parsed && Array.isArray(parsed.rules)) return parsed;
    } catch (e) {
      // 解析失败则回退到默认配置
    }
  }
  return DEFAULT_CONFIG;
}

// ===== 路径匹配 =====
// - 不含 '*' 的规则：保持原有「前缀匹配」行为（向后兼容）。
// - 含 '*' 的规则：'*' 匹配任意字符（含 '/'）。前缀语义（后面可再跟任意内容），
//   并对结尾斜杠做容错：'/*/callback/' 也可命中以 '/callback' 结尾（无尾斜杠）的路径。
function pathMatches(path, prefix) {
  if (!prefix.includes('*')) {
    if (path === prefix) return true;
    if (path.startsWith(prefix)) return true;
    // 允许无尾斜杠精确命中：/api/a/callback 命中 /api/a/callback/
    if (prefix.endsWith('/') && path === prefix.slice(0, -1)) return true;
    return false;
  }
  // 通配匹配：'*' -> '.*'（可跨路径段）。
  const toRegexBody = (p) =>
    '^' +
    p.replace(/[.+?^${}()|[\]\\]/g, '\\$&') // 转义正则特殊字符
      .replace(/\*/g, '.*'); // '*' 匹配任意字符
  // 前缀语义（不锚定结尾），命中后允许再跟任意内容。
  if (new RegExp(toRegexBody(prefix)).test(path)) return true;
  // 结尾斜杠容错：'/*/callback/' 也命中以 '/*/callback' 结尾的路径。
  if (prefix.endsWith('/') && new RegExp(toRegexBody(prefix.slice(0, -1)) + '$').test(path)) return true;
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
