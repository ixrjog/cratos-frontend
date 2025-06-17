import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinopsRoutingModule } from './finops-routing.module';
import { FinopsComponent } from './finops.component';
import { FinopsAppCostComponent } from './finops-app-cost/finops-app-cost.component';
import { FinopsAppCostDetailComponent } from './finops-app-cost/finops-app-cost-detail/finops-app-cost-detail.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { DCommonModule, LoadingModule, PopoverModule, RadioModule, SplitterModule, TagsModule } from 'ng-devui';
import { SharedModule } from '../../@shared/shared.module';


@NgModule({
  declarations: [
    FinopsComponent,
    FinopsAppCostComponent,
    FinopsAppCostDetailComponent
  ],
  imports: [
    DaGridModule,
    CommonModule,
    FinopsRoutingModule,
    DCommonModule,
    LoadingModule,
    PopoverModule,
    RadioModule,
    SharedModule,
    SplitterModule,
    TagsModule,
  ],
})
export class FinopsModule { }
