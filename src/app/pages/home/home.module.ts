import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeHelpComponent } from './home-help/home-help.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { SharedModule } from '../../@shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    HomeComponent,
    HomeHelpComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    DaGridModule,
    SharedModule,
    MarkdownModule,
  ],
})
export class HomeModule { }
