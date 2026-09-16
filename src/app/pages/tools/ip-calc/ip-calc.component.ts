import { Component } from '@angular/core';

interface ResultRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-ip-calc',
  templateUrl: './ip-calc.component.html',
  styleUrls: [ './ip-calc.component.less' ],
})
export class IpCalcComponent {
  input = '192.168.1.10/24';

  // 子网前缀下拉：选不同前缀即可看同一 IP 在不同子网下的信息
  selectedPrefix = 24;
  prefixOptions = Array.from({ length: 33 }, (_, i) => ({
    label: `/${i}  (${this.prefixToMask(i)})`,
    value: i,
  }));

  rows: ResultRow[] = [];
  errorMsg = '';

  // ===== 两个 IP 的最小包含子网 =====
  ipA = '192.168.1.10';
  ipB = '192.168.1.200';
  pairRows: ResultRow[] = [];
  pairError = '';

  /** 计算同时包含 ipA、ipB 的最小子网(最长前缀) */
  calcCommonSubnet(): void {
    this.pairError = '';
    this.pairRows = [];
    try {
      const a = (this.ipA || '').trim();
      const b = (this.ipB || '').trim();
      this.validateIp(a);
      this.validateIp(b);
      const na = this.toInt(a);
      const nb = this.toInt(b);
      // 异或后从高位起的公共前缀长度即最小子网前缀
      const diff = (na ^ nb) >>> 0;
      let prefix = 32;
      if (diff !== 0) {
        // clz: 最高差异位左侧的相同位数
        let x = diff;
        let firstDiff = 0; // 从高位数, 第一个为 1 的位序号(0-based)
        while ((x & 0x80000000) === 0) {
          firstDiff++;
          x = (x << 1) >>> 0;
        }
        prefix = firstDiff; // 公共前缀长度
      }
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const wildcard = (~mask) >>> 0;
      const network = (na & mask) >>> 0;
      const broadcast = (network | wildcard) >>> 0;
      const totalAddrs = Math.pow(2, 32 - prefix);
      this.pairRows = [
        { label: '最小子网 (CIDR)', value: `${this.toDotted(network)}/${prefix}` },
        { label: '前缀长度', value: `/${prefix}` },
        { label: '子网掩码', value: this.toDotted(mask) },
        { label: '网络地址', value: this.toDotted(network) },
        { label: '广播地址', value: prefix >= 31 ? '—' : this.toDotted(broadcast) },
        { label: '地址范围', value: `${this.toDotted(network)} - ${this.toDotted(broadcast)}` },
        { label: '地址总数', value: `${totalAddrs}` },
      ];
    } catch (e: any) {
      this.pairError = e?.message || String(e);
    }
  }

  // 该 IP 在各前缀下所属的网段一览
  ranges: { prefix: number; cidr: string; mask: string; range: string; hosts: string }[] = [];

  private buildRanges(ip: string): void {
    const ipNum = this.toInt(ip);
    this.ranges = [];
    for (let p = 0; p <= 32; p++) {
      const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
      const wildcard = (~mask) >>> 0;
      const network = (ipNum & mask) >>> 0;
      const broadcast = (network | wildcard) >>> 0;
      const total = Math.pow(2, 32 - p);
      this.ranges.push({
        prefix: p,
        cidr: `${this.toDotted(network)}/${p}`,
        mask: this.toDotted(mask),
        range: `${this.toDotted(network)} - ${this.toDotted(broadcast)}`,
        hosts: `${total}`,
      });
    }
  }

  // 通过输入框（IP/CIDR 或 IP 掩码）计算，并同步下拉前缀
  calc(): void {
    this.errorMsg = '';
    this.rows = [];
    this.ranges = [];
    try {
      const { ip, prefix } = this.parse(this.input);
      this.selectedPrefix = prefix;
      this.compute(ip, prefix);
    } catch (e: any) {
      this.errorMsg = e?.message || String(e);
    }
  }

  // 下拉切换前缀时：用当前输入里的 IP + 选中的前缀重算
  onPrefixChange(): void {
    this.errorMsg = '';
    this.rows = [];
    this.ranges = [];
    try {
      const ipOnly = (this.input || '').trim().split(/[\s/]/)[0];
      this.validateIp(ipOnly);
      this.compute(ipOnly, this.selectedPrefix);
      // 让输入框跟随下拉，保持一致
      this.input = `${ipOnly}/${this.selectedPrefix}`;
    } catch (e: any) {
      this.errorMsg = e?.message || String(e);
    }
  }

  private compute(ip: string, prefix: number): void {
    const ipNum = this.toInt(ip);
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const wildcard = (~mask) >>> 0;
      const network = (ipNum & mask) >>> 0;
      const broadcast = (network | wildcard) >>> 0;

      const totalHosts = prefix >= 31 ? 0 : (wildcard - 1);
      const totalAddrs = Math.pow(2, 32 - prefix);

      // 主机范围
      let firstHost: number, lastHost: number;
      if (prefix >= 31) {
        // /31 (点对点) 和 /32 (单主机) 特殊
        firstHost = network;
        lastHost = broadcast;
      } else {
        firstHost = (network + 1) >>> 0;
        lastHost = (broadcast - 1) >>> 0;
      }

      const ipClass = this.classOf(ipNum);
      const isPrivate = this.isPrivate(ipNum);

      this.rows = [
        { label: 'CIDR', value: `${this.toDotted(network)}/${prefix}` },
        { label: '网络地址 (Network)', value: this.toDotted(network) },
        { label: '广播地址 (Broadcast)', value: prefix >= 31 ? '—' : this.toDotted(broadcast) },
        { label: '子网掩码 (Netmask)', value: `${this.toDotted(mask)}  (0x${mask.toString(16).padStart(8, '0')})` },
        { label: '通配符掩码 (Wildcard)', value: this.toDotted(wildcard) },
        { label: '可用主机范围', value: prefix >= 31 ? `${this.toDotted(firstHost)} - ${this.toDotted(lastHost)}` : `${this.toDotted(firstHost)} - ${this.toDotted(lastHost)}` },
        { label: '可用主机数', value: `${prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, totalHosts)}` },
        { label: '地址总数', value: `${totalAddrs}` },
        { label: '前缀长度', value: `/${prefix}` },
        { label: 'IP 类别', value: ipClass },
        { label: '类型', value: isPrivate ? '私有地址 (RFC 1918)' : '公网/其它' },
        { label: '二进制', value: this.toBinary(network) },
      ];
      this.buildRanges(ip);
  }

  // 输入解析：支持 "IP/prefix"、"IP 掩码"、纯 IP(默认 /32)
  private parse(raw: string): { ip: string; prefix: number } {
    const s = (raw || '').trim();
    if (!s) {
      throw new Error('请输入 IP，如 192.168.1.10/24');
    }
    // IP + 空格 + 点分掩码
    const spaceParts = s.split(/\s+/);
    if (spaceParts.length === 2 && spaceParts[1].includes('.')) {
      const ip = spaceParts[0];
      const prefix = this.maskToPrefix(spaceParts[1]);
      this.validateIp(ip);
      return { ip, prefix };
    }
    // CIDR
    const slash = s.split('/');
    const ip = slash[0];
    this.validateIp(ip);
    let prefix = 32;
    if (slash.length === 2) {
      if (slash[1].includes('.')) {
        prefix = this.maskToPrefix(slash[1]);
      } else {
        prefix = parseInt(slash[1], 10);
        if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
          throw new Error('前缀长度必须是 0-32');
        }
      }
    }
    return { ip, prefix };
  }

  private validateIp(ip: string): void {
    const parts = ip.split('.');
    if (parts.length !== 4) {
      throw new Error(`IP 格式错误：${ip}`);
    }
    for (const p of parts) {
      if (!/^\d+$/.test(p)) {
        throw new Error(`IP 格式错误：${ip}`);
      }
      const n = parseInt(p, 10);
      if (n < 0 || n > 255) {
        throw new Error(`IP 每段需在 0-255：${ip}`);
      }
    }
  }

  private maskToPrefix(mask: string): number {
    this.validateIp(mask);
    const n = this.toInt(mask) >>> 0;
    // 掩码必须是连续 1 后跟连续 0
    const inv = (~n) >>> 0;
    if (((inv + 1) & inv) !== 0 && n !== 0xffffffff && n !== 0) {
      throw new Error(`不是合法的连续子网掩码：${mask}`);
    }
    let count = 0;
    let x = n;
    while (x & 0x80000000) {
      count++;
      x = (x << 1) >>> 0;
    }
    return count;
  }

  private prefixToMask(prefix: number): string {
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    return this.toDotted(mask);
  }

  private toInt(ip: string): number {
    return ip.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct, 10)) >>> 0, 0) >>> 0;
  }

  private toDotted(n: number): string {
    return [ (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255 ].join('.');
  }

  private toBinary(n: number): string {
    const b = (n >>> 0).toString(2).padStart(32, '0');
    return `${b.slice(0, 8)}.${b.slice(8, 16)}.${b.slice(16, 24)}.${b.slice(24)}`;
  }

  private classOf(n: number): string {
    const first = (n >>> 24) & 255;
    if (first < 128) {
      return 'A';
    }
    if (first < 192) {
      return 'B';
    }
    if (first < 224) {
      return 'C';
    }
    if (first < 240) {
      return 'D (组播)';
    }
    return 'E (保留)';
  }

  private isPrivate(n: number): boolean {
    const a = (n >>> 24) & 255;
    const b = (n >>> 16) & 255;
    // 10.0.0.0/8
    if (a === 10) {
      return true;
    }
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }
    // 192.168.0.0/16
    if (a === 192 && b === 168) {
      return true;
    }
    // 127/8 loopback 也算特殊
    if (a === 127) {
      return true;
    }
    return false;
  }

  copy(text: string): void {
    if (!text) {
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => this.fallbackCopy(text));
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }
}
