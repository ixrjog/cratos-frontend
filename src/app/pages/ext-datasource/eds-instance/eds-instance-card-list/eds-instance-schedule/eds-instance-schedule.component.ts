import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { EdsScheduleService } from '../../../../../@core/services/ext-datasource-schedule.service';
import {
  AddScheduleJob,
  CheckCron,
  DeleteScheduleJob,
  ScheduleVO,
  UpdateScheduleJob,
} from '../../../../../@core/data/ext-datasource-schedule';
import { map } from 'rxjs/operators';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { finalize } from 'rxjs';
import { RELATIVE_TIME_LIMIT } from '../../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-eds-instance-schedule',
  templateUrl: './eds-instance-schedule.component.html',
  styleUrls: [ './eds-instance-schedule.component.less' ],
})
export class EdsInstanceScheduleComponent implements OnInit {

  @Input() fullScreen: any;
  @Input() close: any;
  @Input() assetTypeOptions: any;
  @Input() instanceName: string;
  @Input() instanceId: number;
  @Input() formData: AddScheduleJob;

  layoutDirection: FormLayout = FormLayout.Vertical;
  isFullScreen: boolean = false;
  showAddSchedule: boolean = false;
  executionTime: string[] = [];
  jobTypeOptions: [ 'IMPORT_ASSET_JOB' ];

  table = {
    loading: false,
    data: [],
  };

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(private edsScheduleService: EdsScheduleService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.fullScreen();
  }

  addSchedule() {
    this.showAddSchedule = !this.showAddSchedule;
  }

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    jobTime: {
      validators: [ { required: true } ],
      asyncValidators: [ {
        sameName: this.onCheckCron.bind(this), message: {
          'zh-cn': 'Cron 表达式错误',
          'en-us': 'Cron expression error',
        },
      } ],
      message: 'jobTime can not be null.',
    },
  };

  ngOnInit(): void {
    this.fetchData();
  }

  submitForm({ valid, directive }) {
    if (valid) {
      this.edsScheduleService.addSchedule(this.formData)
        .subscribe(() => this.fetchData());
    } else {
      console.log(directive);
    }
  }

  onCheckCron(cron: string) {
    this.executionTime = [];
    const param: CheckCron = {
      jobTime: cron.trim(),
    };
    return this.edsScheduleService.checkCron(param)
      .pipe(
        map(({ body }) => {
          this.executionTime = body;
          return this.executionTime.length > 0;
        }),
      );
  }

  fetchData() {
    this.table.data = [];
    this.table.loading = true;
    this.edsScheduleService.queryScheduleById({ id: this.instanceId })
      .pipe(
        finalize(() => {
          this.table.loading = false;
        }),
      ).subscribe(({ body }) => this.table.data = body);
  }

  onRowDelete(rowItem: ScheduleVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    const param: DeleteScheduleJob = {
      group: rowItem.group,
      name: rowItem.name,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.edsScheduleService.deleteSchedule(param)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowResume(rowItem: ScheduleVO) {
    const param: UpdateScheduleJob = {
      group: rowItem.group,
      name: rowItem.name,
    };
    this.edsScheduleService.resumeSchedule(param)
      .subscribe(() => this.fetchData());
  }

  onRowPause(rowItem: ScheduleVO) {
    const param: UpdateScheduleJob = {
      group: rowItem.group,
      name: rowItem.name,
    };
    this.edsScheduleService.pauseSchedule(param)
      .subscribe(() => this.fetchData());
  }

  protected readonly JSON = JSON;
  protected readonly limit = RELATIVE_TIME_LIMIT;
}
