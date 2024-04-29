import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BusinessTypeEnum } from '../../../../../@core/data/business';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { DRAWER_DATA, DrawerUtil } from '../../../../../@shared/utils/drawer.util';
import { Router } from '@angular/router';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor } from 'src/app/@shared/utils/data-table.utli';
import { RiskEventImpactEdit, RiskEventVO } from '../../../../../@core/data/risk-event';
import { RiskEventEditorComponent } from '../risk-event-editor/risk-event-editor.component';
import { RiskEventService } from '../../../../../@core/services/risk-event.service';
import { RiskEventImpactEditorComponent } from '../risk-event-impact-editor/risk-event-impact-editor.component';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/utils/data.util';

@Component({
  selector: 'app-risk-event-card',
  templateUrl: './risk-event-card.component.html',
  styleUrls: [ './risk-event-card.component.less' ],
})
export class RiskEventCardComponent {

  @Input() riskEvent: RiskEventVO;
  @Output() onFetchData = new EventEmitter<any>();
  businessType: string = BusinessTypeEnum.RISK_EVENT;

  stickyView = {
    top: 10,
    bottom: 0,
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: RiskEventEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  drawerDate = {
    editorData: {
      ...DRAWER_DATA.editorData,
      width: '70%',
      drawerContentComponent: RiskEventImpactEditorComponent,
    },
  };

  constructor(
    private route: Router,
    private riskEventService: RiskEventService,
    private dialogUtil: DialogUtil,
    private drawerUtil: DrawerUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  onRowEdit(rowItem: RiskEventVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Risk Event',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.onFetchData.emit();
    }, {
      ...rowItem,
      eventTime: new Date(rowItem.eventTime),
    });
  }

  onRowImpact(rowItem: RiskEventVO) {
    const formData: RiskEventImpactEdit = {
      comment: '',
      content: '',
      endTime: undefined,
      riskEventId: this.riskEvent.id,
      sla: true,
      startTime: undefined,
      valid: true,
    };
    const drawerDate = {
      ...this.drawerDate.editorData,
    };
    this.drawerUtil.onDrawer(drawerDate, formData,
      () => this.onFetchData.emit(),
      {
        riskEventName: rowItem.name,
        riskEventId: rowItem.id,
      });
  }

  onRowValid(rowItem: RiskEventVO) {
    this.riskEventService.setRiskEventValidById({ id: rowItem.id })
      .subscribe(() => {
        this.onFetchData.emit();
      });
  }

  onRowDelete(rowItem: RiskEventVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.riskEventService.deleteRiskEventById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData.emit();
        });
    });
  }

  onRowBusinessTag(rowItem: RiskEventVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.onFetchData.emit());
  }

  onRowBusinessDoc(rowItem: RiskEventVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.onFetchData.emit());
  }

  protected readonly getRowColor = getRowColor;

  protected readonly JSON = JSON;

  getSla(riskEventVO: RiskEventVO): string {
    let result = 'SLA: ';
    return result + riskEventVO.totalCost.costDesc
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}

