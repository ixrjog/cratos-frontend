import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfraRoutingModule } from './infra-routing.module';
import { InfraComponent } from './infra.component';
import { InfraInfoComponent } from './infra-info/infra-info.component';
import { InfraInfoService } from '../../@core/services/infra-info.service';
import {
  IconModule,
  LoadingModule,
  SearchModule,
  TabsModule,
  TagsModule,
  PaginationModule,
} from 'ng-devui';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    InfraComponent,
    InfraInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InfraRoutingModule,
    IconModule,
    LoadingModule,
    SearchModule,
    TabsModule,
    TagsModule,
    PaginationModule,
    MarkdownModule,
  ],
  providers: [
    InfraInfoService,
  ],
})
export class InfraModule {
}
