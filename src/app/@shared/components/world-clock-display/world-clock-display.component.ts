import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

interface Zone {
  tz: string;
  label: string;
  iso2?: string;
}

interface ClockRow {
  zone: Zone;
  time: string;
  date: string;
  offset: string;
}

/**
 * 只读的世界时间展示（无任何配置：不能增删/拖动/切换）。
 * 复用世界时间工具页的持久化配置（localStorage），保持一致。
 * 世界时间工具页的配置逻辑仍在 pages/tools/world-clock 里。
 */
@Component({
  selector: 'app-world-clock-display',
  templateUrl: './world-clock-display.component.html',
  styleUrls: [ './world-clock-display.component.less' ],
})
export class WorldClockDisplayComponent implements OnInit, OnDestroy {
  // 与工具页 STORAGE_KEY 保持一致
  private readonly STORAGE_KEY = 'cratos.tools.worldClock.v4';

  @Input() showUtc = true;
  @Input() title = '世界时间';

  use24h = true;
  zones: Zone[] = [];
  rows: ClockRow[] = [];
  utcRow: ClockRow | null = null;

  private timer: any = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.loadFromStorage();
    this.tick();
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.tick());
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private loadFromStorage(): void {
    let tzs: string[] = [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && Array.isArray(obj.tzs)) {
          tzs = obj.tzs.filter((x: any) => typeof x === 'string');
        }
        this.use24h = obj?.use24h !== false;
      }
    } catch {
      // 忽略，走默认
    }
    if (!tzs.length) {
      tzs = [
        'Asia/Shanghai', 'Europe/London', 'Europe/Berlin', 'Africa/Dar_es_Salaam',
        'Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Asia/Dhaka',
        'Asia/Karachi', 'Africa/Kampala', 'Asia/Manila',
      ];
    }

    let regionNames: Intl.DisplayNames | null = null;
    try {
      regionNames = new Intl.DisplayNames([ 'zh-CN' ], { type: 'region' });
    } catch {
      regionNames = null;
    }

    this.zones = tzs.map((tz) => {
      const city = tz.split('/').pop()!.replace(/_/g, ' ');
      const iso2 = ZONE_COUNTRY[tz] || '';
      let country = '';
      if (iso2 && regionNames) {
        try {
          country = regionNames.of(iso2) || '';
        } catch {
          country = '';
        }
      }
      const label = country ? `${country} · ${city}` : city;
      return { tz, label, iso2 };
    });
  }

  private tick(): void {
    const now = new Date();
    this.rows = this.zones.map((z) => this.buildRow(z, now));
    if (this.showUtc) {
      this.utcRow = this.buildRow({ tz: 'UTC', label: 'UTC 世界标准时间', iso2: '' }, now);
    }
  }

  private buildRow(zone: Zone, now: Date): ClockRow {
    const time = new Intl.DateTimeFormat('zh-CN', {
      timeZone: zone.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !this.use24h,
    }).format(now);
    const date = new Intl.DateTimeFormat('zh-CN', {
      timeZone: zone.tz, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
    }).format(now);
    return { zone, time, date, offset: this.utcOffset(zone.tz, now) };
  }

  private utcOffset(tz: string, now: Date): string {
    try {
      const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' } as any);
      const part = dtf.formatToParts(now).find((p) => p.type === 'timeZoneName');
      if (part && /GMT|UTC/.test(part.value)) {
        return part.value.replace('GMT', 'UTC');
      }
    } catch {
      // fall through
    }
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const map: any = {};
    for (const p of dtf.formatToParts(now)) {
      map[p.type] = p.value;
    }
    const asUTC = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour === 24 ? 0 : +map.hour, +map.minute, +map.second);
    const diffMin = Math.round((asUTC - now.getTime()) / 60000);
    const sign = diffMin >= 0 ? '+' : '-';
    const abs = Math.abs(diffMin);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
  }

  flagUrl(iso2?: string): string {
    return iso2 ? `https://flagcdn.com/${iso2.toLowerCase()}.svg` : '';
  }
}

// IANA 时区 -> ISO2（与工具页同源，仅列展示所需的常用项；缺失的仅无国旗/国家码，不影响时间）
const ZONE_COUNTRY: Record<string, string> = {
  'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW', 'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR', 'Asia/Singapore': 'SG', 'Asia/Kolkata': 'IN', 'Asia/Dubai': 'AE',
  'Asia/Bangkok': 'TH', 'Asia/Dhaka': 'BD', 'Asia/Karachi': 'PK', 'Asia/Manila': 'PH',
  'Asia/Jakarta': 'ID', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Kuala_Lumpur': 'MY',
  'Australia/Sydney': 'AU', 'Europe/Moscow': 'RU', 'Europe/London': 'GB', 'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE', 'Europe/Zurich': 'CH', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL', 'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
  'America/Los_Angeles': 'US', 'America/Sao_Paulo': 'BR', 'America/Toronto': 'CA', 'America/Mexico_City': 'MX',
  'Africa/Dar_es_Salaam': 'TZ', 'Africa/Lagos': 'NG', 'Africa/Accra': 'GH', 'Africa/Nairobi': 'KE',
  'Africa/Kampala': 'UG', 'Africa/Cairo': 'EG', 'Africa/Johannesburg': 'ZA', 'Africa/Addis_Ababa': 'ET',
};
