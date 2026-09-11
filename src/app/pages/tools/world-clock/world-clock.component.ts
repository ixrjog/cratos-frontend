import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { ZONE_LATLON } from '../../../@shared/data/zone-latlon';

interface Zone {
  tz: string;      // IANA 时区
  label: string;   // 显示名（国家/城市）
  iso2?: string;   // ISO 3166-1 alpha-2 国家码
}

interface ClockRow {
  zone: Zone;
  time: string;
  date: string;
  offset: string;
}

@Component({
  selector: 'app-world-clock',
  templateUrl: './world-clock.component.html',
  styleUrls: [ './world-clock.component.less' ],
})
export class WorldClockComponent implements OnInit, OnDestroy {
  // 全部时区从浏览器原生 API 动态获取，避免手写清单不全
  options: Zone[] = [];

  private readonly STORAGE_KEY = 'cratos.tools.worldClock.v4';

  selectOptions: { label: string; value: string }[] = [];
  toAdd = '';

  use24h = true;

  // 已添加显示的时区
  selected: Zone[] = [];
  rows: ClockRow[] = [];
  utcRow: ClockRow | null = null;

  localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  private timer: any = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.options = this.buildAllZones();
    // UTC 已作为固定卡片，不进可添加列表
    this.selectOptions = this.options
      .filter((o) => o.tz !== 'UTC' && o.tz !== 'GMT')
      .map((o) => ({ label: o.label, value: o.tz }));

    // 从 localStorage 恢复上次的选择；没有则用默认
    const restored = this.loadState();
    if (restored) {
      this.use24h = restored.use24h;
      this.selected = restored.tzs
        .map((tz) => this.options.find((o) => o.tz === tz))
        .filter((z): z is Zone => !!z);
    } else {
      // 从未保存过：给一组默认时区
      const defaults = [
        'Asia/Shanghai',        // 中国
        'Europe/London',        // 伦敦
        'Europe/Berlin',        // 法兰克福（德国时区）
        'Africa/Dar_es_Salaam', // 坦桑尼亚
        'Africa/Lagos',         // 尼日利亚
        'Africa/Accra',         // 加纳
        'Africa/Nairobi',       // 肯尼亚
        'Asia/Dhaka',           // 孟加拉
        'Asia/Karachi',         // 巴基斯坦
        'Africa/Kampala',       // 乌干达
        'Asia/Manila',          // 菲律宾
      ];
      this.selected = defaults
        .map((tz) => this.options.find((o) => o.tz === tz))
        .filter((z): z is Zone => !!z);
    }
    this.tick();

    // 每秒刷新，放到 zone 外避免频繁变更检测拖累性能，手动进 zone 更新
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

  // 用浏览器原生 API 拿到全部 IANA 时区，映射国家中文名后排序
  private buildAllZones(): Zone[] {
    let tzList: string[] = [];
    try {
      const sv = (Intl as any).supportedValuesOf;
      if (typeof sv === 'function') {
        tzList = sv('timeZone') as string[];
      }
    } catch {
      // 忽略，走回退
    }
    if (!tzList || !tzList.length) {
      // 极老环境回退：至少给常用时区
      tzList = [
        'UTC', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Taipei', 'Asia/Tokyo', 'Asia/Seoul',
        'Asia/Singapore', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Bangkok', 'Australia/Sydney',
        'Europe/Moscow', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Zurich',
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Sao_Paulo',
      ];
    }

    let regionNames: Intl.DisplayNames | null = null;
    try {
      regionNames = new Intl.DisplayNames([ 'zh-CN' ], { type: 'region' });
    } catch {
      regionNames = null;
    }

    const zones: Zone[] = tzList.map((tz) => {
      const city = tz.split('/').pop()!.replace(/_/g, ' ');
      const iso2 = ZONE_COUNTRY[tz];
      let country = '';
      if (iso2 && regionNames) {
        try {
          country = regionNames.of(iso2) || '';
        } catch {
          country = '';
        }
      }
      if (tz === 'UTC' || tz === 'GMT') {
        return { tz, label: `${tz} 世界标准时间`, iso2: '' };
      }
      const label = country ? `${country} · ${city}` : city;
      return { tz, label, iso2: iso2 || '' };
    });

    // 按国家名 + 城市排序，便于查找
    zones.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
    return zones;
  }

  add(): void {
    if (!this.toAdd) {
      return;
    }
    if (this.selected.some((z) => z.tz === this.toAdd)) {
      this.toAdd = '';
      return;
    }
    const zone = this.options.find((o) => o.tz === this.toAdd);
    if (zone) {
      this.selected.push(zone);
      this.toAdd = '';
      this.saveState();
      this.tick();
    }
  }

  remove(tz: string): void {
    this.selected = this.selected.filter((z) => z.tz !== tz);
    this.saveState();
    this.tick();
  }

  toggleFormat(): void {
    this.saveState();
    this.tick();
  }

  // ---------------- 拖拽排序 ----------------
  dragIndex: number | null = null;
  overIndex: number | null = null;

  onDragStart(index: number): void {
    this.dragIndex = index;
  }

  onDragOver(index: number, event: DragEvent): void {
    event.preventDefault(); // 允许 drop
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.overIndex = index;
  }

  onDrop(index: number, event: DragEvent): void {
    event.preventDefault();
    const from = this.dragIndex;
    this.dragIndex = null;
    this.overIndex = null;
    if (from === null || from === index) {
      return;
    }
    const moved = this.selected.splice(from, 1)[0];
    this.selected.splice(index, 0, moved);
    this.saveState();
    this.tick();
  }

  onDragEnd(): void {
    this.dragIndex = null;
    this.overIndex = null;
  }

  private loadState(): { tzs: string[]; use24h: boolean } | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.tzs)) {
        return null;
      }
      return {
        tzs: obj.tzs.filter((x: any) => typeof x === 'string'),
        use24h: obj.use24h !== false, // 默认 24h
      };
    } catch {
      return null;
    }
  }

  private saveState(): void {
    try {
      const payload = {
        tzs: this.selected.map((z) => z.tz),
        use24h: this.use24h,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // localStorage 不可用（隐私模式/禁用）时静默忽略
    }
  }

  private tick(): void {
    const now = new Date();
    this.rows = this.selected.map((zone) => this.buildRow(zone, now));
    this.utcRow = this.buildRow({ tz: 'UTC', label: 'UTC 世界标准时间', iso2: '' }, now);
    this.buildMarkers();
  }

  // 地图打点：把选中时区按经纬度换算成地图上的百分比坐标（equirectangular 投影）
  markers: { label: string; time: string; leftPct: number; topPct: number; dir: string }[] = [];

  private buildMarkers(): void {
    // 1) 先把每个选中时区的点位置算出来（equirectangular，与底图同投影）
    const pts: { label: string; time: string; leftPct: number; topPct: number }[] = [];
    for (const r of this.rows) {
      const ll = ZONE_LATLON[r.zone.tz];
      if (!ll) {
        continue;
      }
      const [lat, lon] = ll;
      pts.push({
        label: r.zone.label,
        time: r.time,
        leftPct: (lon + 180) / 360 * 100,
        topPct: (90 - lat) / 180 * 100,
      });
    }

    // 2) 贪心防重叠标签排布：为每个标签选一个不与已放置标签冲突的方向。
    //    以百分比估算标签包围盒（地图宽高未知，用经验值：标签约 12% 宽 * 6% 高）。
    const LABEL_W = 13; // 标签估算宽度(占地图宽百分比)
    const LABEL_H = 6;  // 标签估算高度(占地图高百分比)
    const GAP = 1.2;    // 点到标签的间隙
    // 候选方向（相对点的标签中心偏移，单位百分比），按优先级排列，含近/远两档
    const candidates = [
      { dir: 'up', dx: 0, dy: -(LABEL_H / 2 + GAP) },
      { dir: 'down', dx: 0, dy: (LABEL_H / 2 + GAP) },
      { dir: 'right', dx: (LABEL_W / 2 + GAP), dy: 0 },
      { dir: 'left', dx: -(LABEL_W / 2 + GAP), dy: 0 },
      { dir: 'up', dx: 0, dy: -(LABEL_H + GAP + LABEL_H / 2) },
      { dir: 'down', dx: 0, dy: (LABEL_H + GAP + LABEL_H / 2) },
      { dir: 'right', dx: (LABEL_W + GAP + LABEL_W / 2), dy: 0 },
      { dir: 'left', dx: -(LABEL_W + GAP + LABEL_W / 2), dy: 0 },
    ];

    const placed: { l: number; r: number; t: number; b: number }[] = [];
    const overlaps = (a: any, b: any) =>
      a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

    const markers: { label: string; time: string; leftPct: number; topPct: number; dir: string }[] = [];
    // 先放靠上的点，避免不同点争抢同一位置时次序随机
    const order = pts.map((p, i) => i).sort((i, j) => pts[i].topPct - pts[j].topPct);
    for (const idx of order) {
      const p = pts[idx];
      let chosen = candidates[0];
      let done = false;
      for (const c of candidates) {
        const cx = p.leftPct + c.dx;
        const cy = p.topPct + c.dy;
        const box = {
          l: cx - LABEL_W / 2, r: cx + LABEL_W / 2,
          t: cy - LABEL_H / 2, b: cy + LABEL_H / 2,
        };
        if (!placed.some(pb => overlaps(box, pb))) {
          chosen = c;
          placed.push(box);
          done = true;
          break;
        }
      }
      // 所有候选都冲突：落到首选方向，仍登记其包围盒(尽力而为，避免后续标签再叠上来)
      if (!done) {
        const cx = p.leftPct + chosen.dx;
        const cy = p.topPct + chosen.dy;
        placed.push({ l: cx - LABEL_W / 2, r: cx + LABEL_W / 2, t: cy - LABEL_H / 2, b: cy + LABEL_H / 2 });
      }
      markers.push({ label: p.label, time: p.time, leftPct: p.leftPct, topPct: p.topPct, dir: chosen.dir });
    }
    this.markers = markers;
  }

  private buildRow(zone: Zone, now: Date): ClockRow {
    const time = new Intl.DateTimeFormat('zh-CN', {
      timeZone: zone.tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: !this.use24h,
    }).format(now);

    const date = new Intl.DateTimeFormat('zh-CN', {
      timeZone: zone.tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }).format(now);

    return {
      zone,
      time,
      date,
      offset: this.utcOffset(zone.tz, now),
    };
  }

  // 计算相对 UTC 的偏移，如 UTC+8、UTC-5、UTC+5:30
  private utcOffset(tz: string, now: Date): string {
    try {
      const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset',
      } as any);
      const part = dtf.formatToParts(now).find((p) => p.type === 'timeZoneName');
      if (part && /GMT|UTC/.test(part.value)) {
        return part.value.replace('GMT', 'UTC');
      }
    } catch {
      // 部分环境不支持 shortOffset，退回手工计算
    }
    return this.manualOffset(tz, now);
  }

  private manualOffset(tz: string, now: Date): string {
    // 用该时区格式化出的本地墙钟时间反推与 UTC 的差
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    const parts = dtf.formatToParts(now);
    const map: any = {};
    for (const p of parts) {
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
}

// IANA 时区 -> ISO 3166-1 alpha-2 国家代码（源自 IANA zone.tab，配合 Intl.DisplayNames 得到中文国名）
const ZONE_COUNTRY: Record<string, string> = {
  'Africa/Abidjan': 'CI',
  'Africa/Accra': 'GH',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Algiers': 'DZ',
  'Africa/Asmara': 'ER',
  'Africa/Bamako': 'ML',
  'Africa/Bangui': 'CF',
  'Africa/Banjul': 'GM',
  'Africa/Bissau': 'GW',
  'Africa/Blantyre': 'MW',
  'Africa/Brazzaville': 'CG',
  'Africa/Bujumbura': 'BI',
  'Africa/Cairo': 'EG',
  'Africa/Casablanca': 'MA',
  'Africa/Ceuta': 'ES',
  'Africa/Conakry': 'GN',
  'Africa/Dakar': 'SN',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Djibouti': 'DJ',
  'Africa/Douala': 'CM',
  'Africa/El_Aaiun': 'EH',
  'Africa/Freetown': 'SL',
  'Africa/Gaborone': 'BW',
  'Africa/Harare': 'ZW',
  'Africa/Johannesburg': 'ZA',
  'Africa/Juba': 'SS',
  'Africa/Kampala': 'UG',
  'Africa/Khartoum': 'SD',
  'Africa/Kigali': 'RW',
  'Africa/Kinshasa': 'CD',
  'Africa/Lagos': 'NG',
  'Africa/Libreville': 'GA',
  'Africa/Lome': 'TG',
  'Africa/Luanda': 'AO',
  'Africa/Lubumbashi': 'CD',
  'Africa/Lusaka': 'ZM',
  'Africa/Malabo': 'GQ',
  'Africa/Maputo': 'MZ',
  'Africa/Maseru': 'LS',
  'Africa/Mbabane': 'SZ',
  'Africa/Mogadishu': 'SO',
  'Africa/Monrovia': 'LR',
  'Africa/Nairobi': 'KE',
  'Africa/Ndjamena': 'TD',
  'Africa/Niamey': 'NE',
  'Africa/Nouakchott': 'MR',
  'Africa/Ouagadougou': 'BF',
  'Africa/Porto-Novo': 'BJ',
  'Africa/Sao_Tome': 'ST',
  'Africa/Tripoli': 'LY',
  'Africa/Tunis': 'TN',
  'Africa/Windhoek': 'NA',
  'America/Adak': 'US',
  'America/Anchorage': 'US',
  'America/Anguilla': 'AI',
  'America/Antigua': 'AG',
  'America/Araguaina': 'BR',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Argentina/Catamarca': 'AR',
  'America/Argentina/Cordoba': 'AR',
  'America/Argentina/Jujuy': 'AR',
  'America/Argentina/La_Rioja': 'AR',
  'America/Argentina/Mendoza': 'AR',
  'America/Argentina/Rio_Gallegos': 'AR',
  'America/Argentina/Salta': 'AR',
  'America/Argentina/San_Juan': 'AR',
  'America/Argentina/San_Luis': 'AR',
  'America/Argentina/Tucuman': 'AR',
  'America/Argentina/Ushuaia': 'AR',
  'America/Aruba': 'AW',
  'America/Asuncion': 'PY',
  'America/Atikokan': 'CA',
  'America/Bahia': 'BR',
  'America/Bahia_Banderas': 'MX',
  'America/Barbados': 'BB',
  'America/Belem': 'BR',
  'America/Belize': 'BZ',
  'America/Blanc-Sablon': 'CA',
  'America/Boa_Vista': 'BR',
  'America/Bogota': 'CO',
  'America/Boise': 'US',
  'America/Cambridge_Bay': 'CA',
  'America/Campo_Grande': 'BR',
  'America/Cancun': 'MX',
  'America/Caracas': 'VE',
  'America/Cayenne': 'GF',
  'America/Cayman': 'KY',
  'America/Chicago': 'US',
  'America/Chihuahua': 'MX',
  'America/Ciudad_Juarez': 'MX',
  'America/Costa_Rica': 'CR',
  'America/Coyhaique': 'CL',
  'America/Creston': 'CA',
  'America/Cuiaba': 'BR',
  'America/Curacao': 'CW',
  'America/Danmarkshavn': 'GL',
  'America/Dawson': 'CA',
  'America/Dawson_Creek': 'CA',
  'America/Denver': 'US',
  'America/Detroit': 'US',
  'America/Dominica': 'DM',
  'America/Edmonton': 'CA',
  'America/Eirunepe': 'BR',
  'America/El_Salvador': 'SV',
  'America/Fort_Nelson': 'CA',
  'America/Fortaleza': 'BR',
  'America/Glace_Bay': 'CA',
  'America/Goose_Bay': 'CA',
  'America/Grand_Turk': 'TC',
  'America/Grenada': 'GD',
  'America/Guadeloupe': 'GP',
  'America/Guatemala': 'GT',
  'America/Guayaquil': 'EC',
  'America/Guyana': 'GY',
  'America/Halifax': 'CA',
  'America/Havana': 'CU',
  'America/Hermosillo': 'MX',
  'America/Indiana/Indianapolis': 'US',
  'America/Indiana/Knox': 'US',
  'America/Indiana/Marengo': 'US',
  'America/Indiana/Petersburg': 'US',
  'America/Indiana/Tell_City': 'US',
  'America/Indiana/Vevay': 'US',
  'America/Indiana/Vincennes': 'US',
  'America/Indiana/Winamac': 'US',
  'America/Inuvik': 'CA',
  'America/Iqaluit': 'CA',
  'America/Jamaica': 'JM',
  'America/Juneau': 'US',
  'America/Kentucky/Louisville': 'US',
  'America/Kentucky/Monticello': 'US',
  'America/Kralendijk': 'BQ',
  'America/La_Paz': 'BO',
  'America/Lima': 'PE',
  'America/Los_Angeles': 'US',
  'America/Lower_Princes': 'SX',
  'America/Maceio': 'BR',
  'America/Managua': 'NI',
  'America/Manaus': 'BR',
  'America/Marigot': 'MF',
  'America/Martinique': 'MQ',
  'America/Matamoros': 'MX',
  'America/Mazatlan': 'MX',
  'America/Menominee': 'US',
  'America/Merida': 'MX',
  'America/Metlakatla': 'US',
  'America/Mexico_City': 'MX',
  'America/Miquelon': 'PM',
  'America/Moncton': 'CA',
  'America/Monterrey': 'MX',
  'America/Montevideo': 'UY',
  'America/Montserrat': 'MS',
  'America/Nassau': 'BS',
  'America/New_York': 'US',
  'America/Nome': 'US',
  'America/Noronha': 'BR',
  'America/North_Dakota/Beulah': 'US',
  'America/North_Dakota/Center': 'US',
  'America/North_Dakota/New_Salem': 'US',
  'America/Nuuk': 'GL',
  'America/Ojinaga': 'MX',
  'America/Panama': 'PA',
  'America/Paramaribo': 'SR',
  'America/Phoenix': 'US',
  'America/Port-au-Prince': 'HT',
  'America/Port_of_Spain': 'TT',
  'America/Porto_Velho': 'BR',
  'America/Puerto_Rico': 'PR',
  'America/Punta_Arenas': 'CL',
  'America/Rankin_Inlet': 'CA',
  'America/Recife': 'BR',
  'America/Regina': 'CA',
  'America/Resolute': 'CA',
  'America/Rio_Branco': 'BR',
  'America/Santarem': 'BR',
  'America/Santiago': 'CL',
  'America/Santo_Domingo': 'DO',
  'America/Sao_Paulo': 'BR',
  'America/Scoresbysund': 'GL',
  'America/Sitka': 'US',
  'America/St_Barthelemy': 'BL',
  'America/St_Johns': 'CA',
  'America/St_Kitts': 'KN',
  'America/St_Lucia': 'LC',
  'America/St_Thomas': 'VI',
  'America/St_Vincent': 'VC',
  'America/Swift_Current': 'CA',
  'America/Tegucigalpa': 'HN',
  'America/Thule': 'GL',
  'America/Tijuana': 'MX',
  'America/Toronto': 'CA',
  'America/Tortola': 'VG',
  'America/Vancouver': 'CA',
  'America/Whitehorse': 'CA',
  'America/Winnipeg': 'CA',
  'America/Yakutat': 'US',
  'Antarctica/Casey': 'AQ',
  'Antarctica/Davis': 'AQ',
  'Antarctica/DumontDUrville': 'AQ',
  'Antarctica/Macquarie': 'AU',
  'Antarctica/Mawson': 'AQ',
  'Antarctica/McMurdo': 'AQ',
  'Antarctica/Palmer': 'AQ',
  'Antarctica/Rothera': 'AQ',
  'Antarctica/Syowa': 'AQ',
  'Antarctica/Troll': 'AQ',
  'Antarctica/Vostok': 'AQ',
  'Arctic/Longyearbyen': 'SJ',
  'Asia/Aden': 'YE',
  'Asia/Almaty': 'KZ',
  'Asia/Amman': 'JO',
  'Asia/Anadyr': 'RU',
  'Asia/Aqtau': 'KZ',
  'Asia/Aqtobe': 'KZ',
  'Asia/Ashgabat': 'TM',
  'Asia/Atyrau': 'KZ',
  'Asia/Baghdad': 'IQ',
  'Asia/Bahrain': 'BH',
  'Asia/Baku': 'AZ',
  'Asia/Bangkok': 'TH',
  'Asia/Barnaul': 'RU',
  'Asia/Beirut': 'LB',
  'Asia/Bishkek': 'KG',
  'Asia/Brunei': 'BN',
  'Asia/Chita': 'RU',
  'Asia/Colombo': 'LK',
  'Asia/Damascus': 'SY',
  'Asia/Dhaka': 'BD',
  'Asia/Dili': 'TL',
  'Asia/Dubai': 'AE',
  'Asia/Dushanbe': 'TJ',
  'Asia/Famagusta': 'CY',
  'Asia/Gaza': 'PS',
  'Asia/Hebron': 'PS',
  'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Hong_Kong': 'HK',
  'Asia/Hovd': 'MN',
  'Asia/Irkutsk': 'RU',
  'Asia/Jakarta': 'ID',
  'Asia/Jayapura': 'ID',
  'Asia/Jerusalem': 'IL',
  'Asia/Kabul': 'AF',
  'Asia/Kamchatka': 'RU',
  'Asia/Karachi': 'PK',
  'Asia/Kathmandu': 'NP',
  'Asia/Khandyga': 'RU',
  'Asia/Kolkata': 'IN',
  'Asia/Krasnoyarsk': 'RU',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Kuching': 'MY',
  'Asia/Kuwait': 'KW',
  'Asia/Macau': 'MO',
  'Asia/Magadan': 'RU',
  'Asia/Makassar': 'ID',
  'Asia/Manila': 'PH',
  'Asia/Muscat': 'OM',
  'Asia/Nicosia': 'CY',
  'Asia/Novokuznetsk': 'RU',
  'Asia/Novosibirsk': 'RU',
  'Asia/Omsk': 'RU',
  'Asia/Oral': 'KZ',
  'Asia/Phnom_Penh': 'KH',
  'Asia/Pontianak': 'ID',
  'Asia/Pyongyang': 'KP',
  'Asia/Qatar': 'QA',
  'Asia/Qostanay': 'KZ',
  'Asia/Qyzylorda': 'KZ',
  'Asia/Riyadh': 'SA',
  'Asia/Sakhalin': 'RU',
  'Asia/Samarkand': 'UZ',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Singapore': 'SG',
  'Asia/Srednekolymsk': 'RU',
  'Asia/Taipei': 'TW',
  'Asia/Tashkent': 'UZ',
  'Asia/Tbilisi': 'GE',
  'Asia/Tehran': 'IR',
  'Asia/Thimphu': 'BT',
  'Asia/Tokyo': 'JP',
  'Asia/Tomsk': 'RU',
  'Asia/Ulaanbaatar': 'MN',
  'Asia/Urumqi': 'CN',
  'Asia/Ust-Nera': 'RU',
  'Asia/Vientiane': 'LA',
  'Asia/Vladivostok': 'RU',
  'Asia/Yakutsk': 'RU',
  'Asia/Yangon': 'MM',
  'Asia/Yekaterinburg': 'RU',
  'Asia/Yerevan': 'AM',
  'Atlantic/Azores': 'PT',
  'Atlantic/Bermuda': 'BM',
  'Atlantic/Canary': 'ES',
  'Atlantic/Cape_Verde': 'CV',
  'Atlantic/Faroe': 'FO',
  'Atlantic/Madeira': 'PT',
  'Atlantic/Reykjavik': 'IS',
  'Atlantic/South_Georgia': 'GS',
  'Atlantic/St_Helena': 'SH',
  'Atlantic/Stanley': 'FK',
  'Australia/Adelaide': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Broken_Hill': 'AU',
  'Australia/Darwin': 'AU',
  'Australia/Eucla': 'AU',
  'Australia/Hobart': 'AU',
  'Australia/Lindeman': 'AU',
  'Australia/Lord_Howe': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Perth': 'AU',
  'Australia/Sydney': 'AU',
  'Europe/Amsterdam': 'NL',
  'Europe/Andorra': 'AD',
  'Europe/Astrakhan': 'RU',
  'Europe/Athens': 'GR',
  'Europe/Belgrade': 'RS',
  'Europe/Berlin': 'DE',
  'Europe/Bratislava': 'SK',
  'Europe/Brussels': 'BE',
  'Europe/Bucharest': 'RO',
  'Europe/Budapest': 'HU',
  'Europe/Busingen': 'DE',
  'Europe/Chisinau': 'MD',
  'Europe/Copenhagen': 'DK',
  'Europe/Dublin': 'IE',
  'Europe/Gibraltar': 'GI',
  'Europe/Guernsey': 'GG',
  'Europe/Helsinki': 'FI',
  'Europe/Isle_of_Man': 'IM',
  'Europe/Istanbul': 'TR',
  'Europe/Jersey': 'JE',
  'Europe/Kaliningrad': 'RU',
  'Europe/Kirov': 'RU',
  'Europe/Kyiv': 'UA',
  'Europe/Lisbon': 'PT',
  'Europe/Ljubljana': 'SI',
  'Europe/London': 'GB',
  'Europe/Luxembourg': 'LU',
  'Europe/Madrid': 'ES',
  'Europe/Malta': 'MT',
  'Europe/Mariehamn': 'AX',
  'Europe/Minsk': 'BY',
  'Europe/Monaco': 'MC',
  'Europe/Moscow': 'RU',
  'Europe/Oslo': 'NO',
  'Europe/Paris': 'FR',
  'Europe/Podgorica': 'ME',
  'Europe/Prague': 'CZ',
  'Europe/Riga': 'LV',
  'Europe/Rome': 'IT',
  'Europe/Samara': 'RU',
  'Europe/San_Marino': 'SM',
  'Europe/Sarajevo': 'BA',
  'Europe/Saratov': 'RU',
  'Europe/Simferopol': 'UA',
  'Europe/Skopje': 'MK',
  'Europe/Sofia': 'BG',
  'Europe/Stockholm': 'SE',
  'Europe/Tallinn': 'EE',
  'Europe/Tirane': 'AL',
  'Europe/Ulyanovsk': 'RU',
  'Europe/Vaduz': 'LI',
  'Europe/Vatican': 'VA',
  'Europe/Vienna': 'AT',
  'Europe/Vilnius': 'LT',
  'Europe/Volgograd': 'RU',
  'Europe/Warsaw': 'PL',
  'Europe/Zagreb': 'HR',
  'Europe/Zurich': 'CH',
  'Indian/Antananarivo': 'MG',
  'Indian/Chagos': 'IO',
  'Indian/Christmas': 'CX',
  'Indian/Cocos': 'CC',
  'Indian/Comoro': 'KM',
  'Indian/Kerguelen': 'TF',
  'Indian/Mahe': 'SC',
  'Indian/Maldives': 'MV',
  'Indian/Mauritius': 'MU',
  'Indian/Mayotte': 'YT',
  'Indian/Reunion': 'RE',
  'Pacific/Apia': 'WS',
  'Pacific/Auckland': 'NZ',
  'Pacific/Bougainville': 'PG',
  'Pacific/Chatham': 'NZ',
  'Pacific/Chuuk': 'FM',
  'Pacific/Easter': 'CL',
  'Pacific/Efate': 'VU',
  'Pacific/Fakaofo': 'TK',
  'Pacific/Fiji': 'FJ',
  'Pacific/Funafuti': 'TV',
  'Pacific/Galapagos': 'EC',
  'Pacific/Gambier': 'PF',
  'Pacific/Guadalcanal': 'SB',
  'Pacific/Guam': 'GU',
  'Pacific/Honolulu': 'US',
  'Pacific/Kanton': 'KI',
  'Pacific/Kiritimati': 'KI',
  'Pacific/Kosrae': 'FM',
  'Pacific/Kwajalein': 'MH',
  'Pacific/Majuro': 'MH',
  'Pacific/Marquesas': 'PF',
  'Pacific/Midway': 'UM',
  'Pacific/Nauru': 'NR',
  'Pacific/Niue': 'NU',
  'Pacific/Norfolk': 'NF',
  'Pacific/Noumea': 'NC',
  'Pacific/Pago_Pago': 'AS',
  'Pacific/Palau': 'PW',
  'Pacific/Pitcairn': 'PN',
  'Pacific/Pohnpei': 'FM',
  'Pacific/Port_Moresby': 'PG',
  'Pacific/Rarotonga': 'CK',
  'Pacific/Saipan': 'MP',
  'Pacific/Tahiti': 'PF',
  'Pacific/Tarawa': 'KI',
  'Pacific/Tongatapu': 'TO',
  'Pacific/Wake': 'UM',
  'Pacific/Wallis': 'WF',
};

// IANA 时区 -> [纬度, 经度]（源自 IANA zone.tab，用于世界地图打点）
// ZONE_LATLON 已抽到 @shared/data/zone-latlon（见顶部 import），此处不再内联
