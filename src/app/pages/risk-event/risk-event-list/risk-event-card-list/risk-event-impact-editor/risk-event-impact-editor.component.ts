import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { DValidateRules } from 'ng-devui';
import { finalize } from 'rxjs';
import { RiskEventImpactEdit, RiskEventImpactVO } from '../../../../../@core/data/risk-event';
import { RiskEventService } from '../../../../../@core/services/risk-event.service';
import { getRowColor } from '../../../../../@shared/utils/data-table.utli';
import { ChannelNetworkVO } from '../../../../../@core/data/channel-network';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-risk-event-impact-editor',
  templateUrl: './risk-event-impact-editor.component.html',
  styleUrls: [ './risk-event-impact-editor.component.less' ],
})
export class RiskEventImpactEditorComponent implements OnInit {

  @Input() fullScreen: any;
  @Input() close: any;
  @Input() riskEventName: string;
  @Input() riskEventId: number;
  @Input() formData: RiskEventImpactEdit;

  businessType: string = BusinessTypeEnum.RISK_EVENT_IMPACT;

  layoutDirection: FormLayout = FormLayout.Vertical;
  isFullScreen: boolean = false;
  showRiskEventImpactEdit: boolean = false;

  table = {
    loading: false,
    data: [],
  };

  impactTime = [];

  newRiskEventImpact: RiskEventImpactEdit = {
    comment: '',
    content: '',
    endTime: undefined,
    riskEventId: 0,
    sla: true,
    startTime: undefined,
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
    content: {
      validators: [ { required: true } ],
      message: 'content can not be null.',
    },
  };
  protected readonly JSON = JSON;
  protected readonly limit = RELATIVE_TIME_LIMIT;

  constructor(private riskEventService: RiskEventService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.fullScreen();
  }

  showRiskEventImpact() {
    this.showRiskEventImpactEdit = !this.showRiskEventImpactEdit;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  onTimeChange(dateList) {
    this.formData.startTime = dateList[0];
    this.formData.endTime = dateList[1];
  }

  onContentChange(content: string) {
    this.formData.content = content;
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: RiskEventImpactEdit = {
        ...this.formData,
        startTime: this.formData.startTime ? this.formData.startTime.getTime() : null,
        endTime: this.formData.endTime ? this.formData.endTime.getTime() : null,
      };
      if (this.formData.id) {
        this.riskEventService.addRiskEventImpact(param)
          .subscribe(() => this.fetchData());
      } else {
        this.riskEventService.updateRiskEventImpact(param)
          .subscribe(() => this.fetchData());
      }
    } else {
      console.log(directive);
    }
  }

  fetchData() {
    this.table.data = [];
    this.table.loading = true;
    this.riskEventService.getRiskEventById({ id: this.riskEventId })
      .pipe(
        finalize(() => {
          this.table.loading = false;
          this.showRiskEventImpactEdit = false
        }),
      ).subscribe(({ body }) => this.table.data = body.impacts);
  }

  onRowEdit(rowItem: RiskEventImpactVO) {
    this.showRiskEventImpactEdit = false;
    setTimeout(() => {
      this.impactTime = [ new Date(rowItem.startTime), new Date(rowItem.endTime) ];
      this.formData = {
        ...rowItem,
        startTime: this.impactTime[0],
        endTime: this.impactTime[1],
      };
      this.showRiskEventImpactEdit = true;
    }, 500);
  }

  onRowNew() {
    this.showRiskEventImpactEdit = false;
    setTimeout(() => {
      this.impactTime = [];
      this.formData = {
        ...this.newRiskEventImpact,
        riskEventId: this.riskEventId,
      };
      this.showRiskEventImpactEdit = true;
    }, 500);
  }

  onRowDelete(rowItem: RiskEventImpactVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.riskEventService.deleteRiskEventImpactById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowValid(rowItem: RiskEventImpactVO) {
    this.riskEventService.setRiskEventImpactValidById({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
  }

  onRowBusinessTag(rowItem: ChannelNetworkVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: ChannelNetworkVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  protected readonly getRowColor = getRowColor;
}
