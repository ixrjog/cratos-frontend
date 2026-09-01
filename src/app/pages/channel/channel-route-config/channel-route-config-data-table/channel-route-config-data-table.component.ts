import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ChannelRouteConfigService } from '../../../../@core/services/channel-route-config.service';
import {
  ChannelRouteConfigLine,
  ChannelRouteConfigPageQuery,
  ChannelRouteConfigVO,
  ChannelRouteLineVO,
} from '../../../../@core/data/channel-route-config';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { DialogService } from 'ng-devui';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import {
  ChannelRouteConfigEditorComponent
} from './channel-route-config-editor/channel-route-config-editor.component';

interface RouteLineGroup {
  lineTag: string;
  enable: boolean;
  enables: { [actionType: string]: boolean };
  actionTypes: string[];
  weights: { [actionType: string]: number };
  rawLines: ChannelRouteLineVO[];
}

@Component({
  selector: 'app-channel-route-config-data-table',
  templateUrl: './channel-route-config-data-table.component.html',
  styleUrls: ['./channel-route-config-data-table.component.less'],
})
export class ChannelRouteConfigDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  private static readonly SEARCH_STORAGE_KEY = 'channel_route_config_search_query';

  queryParam = {
    queryName: localStorage.getItem(ChannelRouteConfigDataTableComponent.SEARCH_STORAGE_KEY) || '',
  };

  table: Table<ChannelRouteConfigVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '60%',
      content: ChannelRouteConfigEditorComponent,
    },
  };

  newConfig = {
    channelId: null,
    country: '',
    routeChannel: '',
    applicationId: null,
    instanceId: null,
    service: '',
    saveApi: '',
    queryApi: '',
    namespace: '',
    valid: true,
    comment: '',
  };

  constructor(private channelRouteConfigService: ChannelRouteConfigService, private dialogUtil: DialogUtil,
              private dialogService: DialogService, private toastUtil: ToastUtil) {
  }

  // ---------- Route Switch ----------
  @ViewChild('routeSwitchTemplate') routeSwitchTemplate: TemplateRef<any>;
  routeSwitchLoading = false;
  routeSwitchSaving = false;
  routeLineGroups: RouteLineGroup[] = [];
  private routeSwitchConfig: ChannelRouteConfigVO = null;
  // 后端 hash 值域上限为 10000, 左开右闭 [0, 10000)。历史数据可能出现 10001 等越界值, 读写时需兼容/钳制。
  private static readonly RANGE_SPACE = 10000;
  private static readonly RANGE_MAX = 10000;

  get rangeSpace(): number {
    return ChannelRouteConfigDataTableComponent.RANGE_SPACE;
  }

  get routeBusinessList(): string[] {
    const set = new Set<string>();
    this.routeLineGroups.forEach(g => g.actionTypes.forEach(a => set.add(a)));
    return Array.from(set);
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    localStorage.setItem(ChannelRouteConfigDataTableComponent.SEARCH_STORAGE_KEY, this.queryParam.queryName);
    const param: ChannelRouteConfigPageQuery = {
      queryName: this.queryParam.queryName,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelRouteConfigService.queryChannelRouteConfigPage(param));
  }

  onSearch() {
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Channel Route Config',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newConfig)));
  }

  onRowEdit(rowItem: ChannelRouteConfigVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Channel Route Config',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(rowItem)));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  // ---------- Route Switch Dialog ----------

  onOpenRouteSwitch(rowItem: ChannelRouteConfigVO) {
    this.routeLineGroups = [];
    this.routeSwitchConfig = null;
    this.routeSwitchLoading = true;
    const channelName = rowItem['channel']?.name || rowItem['routeChannel'] || '';
    const results = this.dialogService.open({
      id: 'route-switch-dialog',
      width: '720px',
      maxHeight: '80vh',
      backdropCloseable: true,
      dialogtype: 'standard',
      title: `Route Switch - ${channelName}`,
      contentTemplate: this.routeSwitchTemplate,
      buttons: [
        {
          cssClass: 'primary',
          text: '切换线路 / Switch Line',
          disabled: false,
          handler: () => this.onSwitchLine(() => results.modalInstance.hide()),
        },
        {
          cssClass: 'common',
          text: 'Cancel',
          handler: () => results.modalInstance.hide(),
        },
      ],
    });
    this.channelRouteConfigService.getRouteConfig({ channelId: rowItem['channelId'] || rowItem['id'] })
      .subscribe(({ body }) => {
        this.routeSwitchLoading = false;
        this.buildRouteGroups(body);
      }, () => {
        this.routeSwitchLoading = false;
      });
  }

  private buildRouteGroups(config: ChannelRouteConfigVO) {
    this.routeSwitchConfig = config;
    const map = new Map<string, RouteLineGroup>();
    (config?.lines || []).forEach(l => {
      if (!map.has(l.lineTag)) {
        map.set(l.lineTag, {
          lineTag: l.lineTag,
          enable: false,
          enables: {},
          actionTypes: [],
          weights: {},
          rawLines: [],
        });
      }
      const group = map.get(l.lineTag);
      group.rawLines.push(l);
      if (l.actionType) {
        if (!group.actionTypes.includes(l.actionType)) {
          group.actionTypes.push(l.actionType);
        }
        // enable 是 (lineTag × actionType) 级别的, 分别记录
        group.enables[l.actionType] = l.enable !== false;
        group.weights[l.actionType] = (l.weight !== null && l.weight !== undefined)
          ? Math.min(100, Math.max(0, l.weight))
          : this.weightFromRange(l.randomStart, l.randomEnd);
      }
    });
    // 线路整体开关: 该线路在任一业务下启用即视为启用
    map.forEach(g => {
      g.enable = g.actionTypes.some(at => g.enables[at]);
    });
    this.routeLineGroups = Array.from(map.values());
  }

  /**
   * 从后端 randomStart/randomEnd 推导滑块权重(0-100), 兼容脏数据:
   * - 后端区间以 RANGE_MAX(=10000) 为满值, 这里归一化到 0-100 供滑块使用;
   * - 负值/undefined 归零; 越界(如 randomEnd=10001)钳制到 RANGE_MAX; start>end 记为 0;
   * - 归一化后四舍五入到整数, 且保证原本 >0 的权重至少为 1(避免被舍成 0)。
   */
  private weightFromRange(randomStart?: number, randomEnd?: number): number {
    const max = ChannelRouteConfigDataTableComponent.RANGE_MAX;
    const start = Math.min(Math.max(0, randomStart || 0), max);
    const end = Math.min(Math.max(0, randomEnd || 0), max);
    const span = Math.max(0, end - start);
    if (span <= 0) {
      return 0;
    }
    const weight = Math.round((span / max) * 100);
    return weight < 1 ? 1 : weight;
  }

  onLineEnableChange(line: RouteLineGroup, enabled: boolean) {
    line.enable = enabled;
    // 整体开关联动到该线路所有业务的 enable
    line.actionTypes.forEach(at => {
      line.enables[at] = enabled;
    });
    if (enabled) {
      return;
    }
    line.actionTypes.forEach(actionType => {
      this.routeLineGroups.forEach(g => {
        if (g.lineTag !== line.lineTag && this.isActionEnabled(g, actionType) && g.weights[actionType] === 0) {
          g.weights[actionType] = 100;
        }
      });
    });
  }

  getServingGroups(actionType: string): RouteLineGroup[] {
    return this.routeLineGroups.filter(g => g.actionTypes.includes(actionType));
  }

  getBizRange(actionType: string, group: RouteLineGroup): { start: number; end: number; percent: number } {
    return this.computeBusinessRanges(actionType).get(group.lineTag) || { start: 0, end: 0, percent: 0 };
  }

  /** 该线路在指定业务下是否启用(enable 为 lineTag×actionType 级别) */
  isActionEnabled(group: RouteLineGroup, actionType: string): boolean {
    return group.enable && group.enables[actionType] !== false;
  }

  private computeBusinessRanges(actionType: string): Map<string, { start: number; end: number; percent: number }> {
    const serving = this.getServingGroups(actionType);
    const totalPositive = serving
      .filter(g => this.isActionEnabled(g, actionType) && (g.weights[actionType] || 0) > 0)
      .reduce((sum, g) => sum + (g.weights[actionType] || 0), 0);
    const space = ChannelRouteConfigDataTableComponent.RANGE_SPACE;
    const result = new Map<string, { start: number; end: number; percent: number }>();
    let cursor = 0;
    serving.forEach(g => {
      const weight = g.weights[actionType] || 0;
      const enabled = this.isActionEnabled(g, actionType);
      if (enabled && weight > 0 && totalPositive > 0) {
        const start = Math.floor((cursor / totalPositive) * space);
        cursor += weight;
        const end = Math.floor((cursor / totalPositive) * space);
        const percent = Math.round((weight / totalPositive) * 1000) / 10;
        result.set(g.lineTag, { start, end, percent });
      } else if (enabled && weight === 0) {
        result.set(g.lineTag, { start: 0, end: 1, percent: 0 });
      } else {
        result.set(g.lineTag, { start: 0, end: 0, percent: 0 });
      }
    });
    return result;
  }

  private buildConfigValue(): ChannelRouteConfigLine[] {
    const result: ChannelRouteConfigLine[] = [];
    this.routeBusinessList.forEach(actionType => {
      const ranges = this.computeBusinessRanges(actionType);
      this.getServingGroups(actionType).forEach(g => {
        const r = ranges.get(g.lineTag) || { start: 0, end: 0, percent: 0 };
        const max = ChannelRouteConfigDataTableComponent.RANGE_MAX;
        // 兼容后端值域上限, 钳制到 [0, RANGE_MAX], 且保证 start<=end
        const start = Math.min(Math.max(0, r.start), max);
        const end = Math.min(Math.max(start, r.end), max);
        result.push({
          lineTag: g.lineTag,
          randomStart: start,
          randomEnd: end,
          enable: this.isActionEnabled(g, actionType),
          actionTypeEnum: actionType,
          suffixNumber: [],
          whiteListAccounts: [],
        });
      });
    });
    return result;
  }

  onSwitchLine(onDone?: () => void) {
    if (!this.routeLineGroups.length || !this.routeSwitchConfig?.id) {
      this.toastUtil.onCommonToast('No route config to switch');
      return;
    }
    if (this.routeSwitchSaving) {
      return;
    }
    this.routeSwitchSaving = true;
    const param = {
      channelRouteConfigId: this.routeSwitchConfig.id,
      saveConfig: {
        id: this.routeSwitchConfig.id,
        route: {
          countryCode: this.routeSwitchConfig['country'] || '',
          channel: this.routeSwitchConfig['channel']?.name || this.routeSwitchConfig['routeChannel'] || '',
        },
        configValue: this.buildConfigValue(),
      },
    };
    this.channelRouteConfigService.callSaveConfig(param).subscribe(() => {
      this.routeSwitchSaving = false;
      this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
      if (onDone) {
        onDone();
      }
    }, () => {
      this.routeSwitchSaving = false;
    });
  }

}
