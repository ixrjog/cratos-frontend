import { Component, OnInit } from '@angular/core';
import { ChannelInfoService } from '../../../@core/services/channel-info.service';
import { ChannelBusinessService } from '../../../@core/services/channel-business.service';
import { ChannelInfoVO, ChannelMemberVO } from '../../../@core/data/channel-info';
import { ChannelBusinessVO } from '../../../@core/data/channel-business';

@Component({
  selector: 'app-channel-report',
  templateUrl: './channel-report.component.html',
  styleUrls: ['./channel-report.component.less'],
})
export class ChannelReportComponent implements OnInit {

  loading = true;
  total = 0;
  countryData: { key: string; value: number }[] = [];
  statusData: { key: string; value: number; color: string }[] = [];
  phaseData: { key: string; value: number; color: string }[] = [];
  priorityData: { key: string; value: number; color: string }[] = [];

  // 角色-用户-渠道
  allChannels: ChannelInfoVO[] = [];
  roleOptions: string[] = [];
  selectedRole = '';
  userChannelMap: { username: string; countryChannels: { country: string; names: string[] }[]; total: number }[] = [];

  // Business
  businessTotal = 0;
  businessByChannel: { key: string; value: number }[] = [];
  businessByDirection: { key: string; value: number; color: string }[] = [];
  businessByOrg: { key: string; value: number }[] = [];
  businessByType: { key: string; value: number }[] = [];
  stackColors = ['#5e7ce0', '#3ac295', '#fa9841', '#f66f6a', '#a97af8', '#50d4ab', '#f6a96c', '#7b8cec', '#e86e6e', '#6dd0c0'];

  constructor(private channelInfoService: ChannelInfoService,
              private channelBusinessService: ChannelBusinessService) {}

  ngOnInit() {
    this.channelInfoService.queryChannelPage({ queryName: '', page: 1, length: 1000 })
      .subscribe(({ body }) => {
        const data = body.data || [];
        this.allChannels = data;
        this.total = data.length;
        this.countryData = this.groupBy(data, 'country');
        this.statusData = this.groupBy(data, 'availableStatus').map(i => ({
          ...i, color: this.getStatusColor(i.key)
        }));
        this.phaseData = this.groupBy(data, 'constructionPhase').map(i => ({
          ...i, color: this.getPhaseColor(i.key)
        }));
        this.priorityData = this.groupBy(data, 'priority').map(i => ({
          ...i, color: this.getPriorityColor(i.key)
        }));
        this.extractRoles(data);
        this.loading = false;
      });
    this.channelBusinessService.queryChannelBusinessPage({ queryName: '', page: 1, length: 1000 })
      .subscribe(({ body }) => {
        const biz = body.data || [];
        this.businessTotal = biz.length;
        this.businessByChannel = this.groupByField(biz, b => b.channel?.name || 'N/A');
        this.businessByDirection = this.groupByField(biz, b => b.businessDirection || 'N/A')
          .map(i => ({ ...i, color: i.key === 'INBOUND' ? '#5e7ce0' : '#3ac295' }));
        this.businessByOrg = this.groupByField(biz, b => b.organization?.name || 'N/A');
        this.businessByType = this.groupByField(biz, b => b.type || 'N/A');
      });
  }

  private groupByField(data: any[], keyFn: (item: any) => string): { key: string; value: number }[] {
    const map: { [key: string]: number } = {};
    data.forEach(item => {
      const key = keyFn(item);
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  private extractRoles(data: ChannelInfoVO[]) {
    const roles = new Set<string>();
    data.forEach(ch => {
      const users = ch.members?.['USER'] || [];
      users.forEach(u => { if (u.role) roles.add(u.role); });
    });
    this.roleOptions = Array.from(roles).sort();
    const saved = localStorage.getItem('channel-report-role');
    if (saved && this.roleOptions.includes(saved)) {
      this.onRoleChange(saved);
    }
  }

  onRoleChange(role: string) {
    this.selectedRole = role;
    localStorage.setItem('channel-report-role', role);
    const map: { [username: string]: { [country: string]: string[] } } = {};
    this.allChannels.forEach(ch => {
      const users = ch.members?.['USER'] || [];
      users.filter(u => u.role === role).forEach(u => {
        if (!map[u.name]) map[u.name] = {};
        const country = ch.country || 'N/A';
        if (!map[u.name][country]) map[u.name][country] = [];
        map[u.name][country].push(ch.name);
      });
    });
    this.userChannelMap = Object.entries(map)
      .map(([username, countryMap]) => {
        const countryChannels = Object.entries(countryMap)
          .map(([country, names]) => ({ country, names }))
          .sort((a, b) => a.country.localeCompare(b.country));
        const total = countryChannels.reduce((sum, c) => sum + c.names.length, 0);
        return { username, countryChannels, total };
      })
      .sort((a, b) => b.total - a.total);
  }

  private groupBy(data: any[], field: string): { key: string; value: number }[] {
    const map: { [key: string]: number } = {};
    data.forEach(item => {
      const key = item[field] || 'N/A';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'HA': return '#3ac295';
      case 'UNSTABLE': return '#fa9841';
      case 'DOWN': return '#f66f6a';
      default: return '#999';
    }
  }

  getPhaseColor(phase: string): string {
    switch (phase) {
      case 'COMPLETED': return '#3ac295';
      case 'TESTING': return '#5e7ce0';
      case 'BUILDING': return '#fa9841';
      case 'PLANNING': return '#999';
      default: return '#999';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return '#f66f6a';
      case 'MEDIUM': return '#fa9841';
      case 'LOW': return '#5e7ce0';
      case 'PENDING': return '#999';
      default: return '#999';
    }
  }
}
