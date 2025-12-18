import { Component, Input, OnInit } from '@angular/core';
import { RiskEventImpactVO } from '../../../../../@core/data/risk-event';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { FormLayout } from 'ng-devui/form';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { getRowColor } from '../../../../../@shared/utils/data-table.utli';
import { DValidateRules } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/constant/date.constant';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { finalize } from 'rxjs';
import {
  TrafficRecordTargetEdit,
  TrafficRouteRecordTargetVO,
  TrafficRouteVO,
} from '../../../../../@core/data/traffic-route';
import { TrafficRouteService } from '../../../../../@core/services/traffic-route.service';

@Component({
  selector: 'app-traffic-layer-route-record-target-editor',
  templateUrl: './traffic-layer-route-record-target-editor.component.html',
  styleUrls: ['./traffic-layer-route-record-target-editor.component.less']
})
export class TrafficLayerRouteRecordTargetEditorComponent implements OnInit {

  @Input() fullScreen: any;
  @Input() close: any;
  @Input() formData: TrafficRecordTargetEdit;
  @Input() trafficRoute: TrafficRouteVO;

  businessType: string = BusinessTypeEnum.TRAFFIC_RECORD_TARGET;

  layoutDirection: FormLayout = FormLayout.Vertical;
  isFullScreen: boolean = false;
  showEdit: boolean = false;
  targetType: string = 'CLOUDFLARE';
  targetTypeOptions = [];

  recordType: string = 'CNAME';
  recordTypeOptions = [
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'CNAME',
      value: 'CNAME',
    },
  ];

  table = {
    loading: false,
    data: [],
  };

  newTrafficRecordTargetEdit: TrafficRecordTargetEdit = {
    trafficRouteId: 0,
    resourceRecord: '',
    recordValue: '',
    recordType: '',
    targetType: '',
    origin: false,
    ttl: 300,
    comment: '',
    valid: true,
  };

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };
  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    resourceRecord: {
      validators: [ { required: true } ],
      message: 'resource record can not be null.',
    },
    recordValue: {
      validators: [ { required: true } ],
      message: 'record value can not be null.',
    },
    ttl: {
      validators: [ { required: true } ],
      message: 'TTL can not be null.',
    },
  };
  protected readonly JSON = JSON;
  protected readonly limit = RELATIVE_TIME_LIMIT;

  constructor(private trafficRouteService: TrafficRouteService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.fullScreen();
  }

  showRouteTarget() {
    this.showEdit = !this.showEdit;
  }

  ngOnInit(): void {
    this.fetchData();
    this.getTargetTypeOptions();
  }

  getTargetTypeOptions() {
    this.trafficRouteService.getTrafficRecordTargetTypeOptions()
      .subscribe(({ body }) => {
        this.targetTypeOptions = body.options;
      });
  }

  onTargetTypeChange(tab) {
    this.targetType = tab;
    this.formData.targetType = this.targetType;
  }

  onRecordTypeChange(tab) {
    this.recordType = tab;
    this.formData.recordType = this.recordType;
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: TrafficRecordTargetEdit = {
        ...this.formData,
      };
      if (this.formData.id) {
        this.trafficRouteService.updateTrafficRecordTarget(param)
          .subscribe(() => this.fetchData());
      } else {
        this.trafficRouteService.addTrafficRecordTarget(param)
          .subscribe(() => this.fetchData());
      }
    } else {
      console.log(directive);
    }
  }

  fetchData() {
    this.table.data = [];
    this.table.loading = true;
    this.trafficRouteService.getTrafficRouteById({ id: this.trafficRoute.id })
      .pipe(
        finalize(() => {
          this.table.loading = false;
          this.showEdit = false;
        }),
      ).subscribe(({ body }) => this.table.data = body.recordTargets);
  }

  onRowEdit(rowItem: TrafficRouteRecordTargetVO) {
    this.showEdit = false;
    setTimeout(() => {
      this.formData = {
        ...rowItem,
      };
      this.targetType = rowItem.targetType;
      this.recordType = rowItem.recordType;
      this.showEdit = true;
    }, 500);
  }

  onRowNew() {
    this.showEdit = false;
    setTimeout(() => {
      this.formData = {
        ...this.newTrafficRecordTargetEdit,
        trafficRouteId: this.trafficRoute.id,
        targetType: this.targetType,
        recordType: this.recordType,
      };
      this.showEdit = true;
    }, 500);
  }

  onRowValid(rowItem: TrafficRouteRecordTargetVO) {
    this.trafficRouteService.setTrafficRecordTargetValidById({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
  }

  onRowBusinessTag(rowItem: RiskEventImpactVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: RiskEventImpactVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  protected readonly getRowColor = getRowColor;
}

