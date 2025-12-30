import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { TrafficRouteService } from '../../../../../@core/services/traffic-route.service';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import {
  SwitchRecordTarget,
  TrafficRouteRecordTargetVO,
  TrafficRouteVO,
  TrafficRoutingOptionEnum,
} from '../../../../../@core/data/traffic-route';
import { finalize } from 'rxjs';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-traffic-layer-route-record-target-switch',
  templateUrl: './traffic-layer-route-record-target-switch.component.html',
  styleUrls: [ './traffic-layer-route-record-target-switch.component.less' ],
})
export class TrafficLayerRouteRecordTargetSwitchComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  trafficRoute: TrafficRouteVO;
  recordTarget: TrafficRouteRecordTargetVO = null;
  recordTargets = [];
  loading: boolean = false;
  proxied: boolean = false;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private trafficRouteService: TrafficRouteService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.trafficRoute = this.data['formData'];
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.recordTarget = null;
    this.trafficRouteService.getTrafficRouteById({ id: this.trafficRoute.id })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(({ body }) => {
        this.trafficRoute = body;
        this.recordTargets = body.recordTargets;
        for (const recordTarget of this.recordTargets) {
          if (!recordTarget.active) {
            this.recordTarget = recordTarget;
            break;
          }
        }

        if (this.recordTarget === null) {
          if (this.trafficRoute?.dnsResolverInstance?.edsType === 'CLOUDFLARE') {
            this.recordTarget = this.recordTargets[0];
          }
        }
      });

  }

  submitForm({ valid, directive }) {
    if (valid) {
      if (this.recordTarget === null) {
        this.toastUtil.onErrorToast('Choose one record target');
        return;
      }
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.switch,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        const param: SwitchRecordTarget = {
          recordTargetId: this.recordTarget.id,
          routingOptions: TrafficRoutingOptionEnum.SINGLE_TARGET,
        };
        if (this.needProxyParam()) {
          param['proxied'] = this.proxied;
        }
        this.trafficRouteService.switchToTarget(param).subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
          this.fetchData();
          this.proxied = false;
        });
      });
    } else {
      console.log(directive);
    }
  }

  needProxyParam() {
    if (this.trafficRoute?.dnsResolverInstance?.edsType === 'CLOUDFLARE') {
      if (this.recordTarget?.targetType === 'CLOUDFLARE') {
        return true;
      }
    }
    return false;
  }

  protected readonly JSON = JSON;
}
