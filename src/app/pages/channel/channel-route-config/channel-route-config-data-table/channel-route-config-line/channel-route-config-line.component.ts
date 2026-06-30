import { Component, Input, OnInit } from '@angular/core';
import { ChannelRouteConfigService } from '../../../../../@core/services/channel-route-config.service';
import { ChannelRouteAddLine, ChannelRouteLineVO } from '../../../../../@core/data/channel-route-config';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-channel-route-config-line',
  templateUrl: './channel-route-config-line.component.html',
  styleUrls: ['./channel-route-config-line.component.less'],
})
export class ChannelRouteConfigLineComponent implements OnInit {

  @Input() data: any;
  routeConfigId: number;
  lines: ChannelRouteLineVO[] = [];
  loading = false;
  saving = false;

  newLine: ChannelRouteAddLine = this.emptyLine();

  constructor(private channelRouteConfigService: ChannelRouteConfigService, private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.routeConfigId = this.data?.routeConfigId;
    this.newLine.routeConfigId = this.routeConfigId;
    this.fetchLines();
  }

  private emptyLine(): ChannelRouteAddLine {
    return {
      routeConfigId: this.routeConfigId,
      lineTag: '',
      actionType: '',
      weight: 0,
      valid: true,
      whiteListAccounts: '',
      suffixNumber: '',
      comment: '',
    };
  }

  fetchLines() {
    this.loading = true;
    this.channelRouteConfigService.queryChannelRouteConfigLine({ routeConfigId: this.routeConfigId })
      .subscribe(({ body }) => {
        this.lines = body || [];
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  onAddLine() {
    if (!this.newLine.lineTag) {
      this.toastUtil.onCommonToast('Line Tag is required');
      return;
    }
    this.saving = true;
    this.channelRouteConfigService.addLine({ ...this.newLine, routeConfigId: this.routeConfigId })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
        this.saving = false;
        this.newLine = this.emptyLine();
        this.fetchLines();
      }, () => {
        this.saving = false;
      });
  }

}
