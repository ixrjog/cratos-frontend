import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtDatasourceRoutingModule } from './ext-datasource-routing.module';
import { ExtDatasourceComponent } from './ext-datasource.component';
import { EdsInstanceComponent } from './eds-instance/eds-instance.component';
import { EdsConfigComponent } from './eds-config/eds-config.component';
import { EdsConfigDataTableComponent } from './eds-config/eds-config-data-table/eds-config-data-table.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { EdsConfigEditorComponent } from './eds-config/eds-config-data-table/eds-config-editor/eds-config-editor.component';
import {
  ButtonModule,
  DataTableModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
} from 'ng-devui';
import { SharedModule } from '../../@shared/shared.module';
import { EdsInstanceCardListComponent } from './eds-instance/eds-instance-card-list/eds-instance-card-list.component';
import {
  EdsInstanceEditorComponent
} from './eds-instance/eds-instance-card-list/eds-instance-editor/eds-instance-editor.component';
import {
  EdsInstanceCardComponent
} from './eds-instance/eds-instance-card-list/eds-instance-card/eds-instance-card.component';
import { EdsAssetComponent } from './eds-instance/eds-asset/eds-asset.component';
import { EdsAssetDataTableComponent } from './eds-instance/eds-asset/eds-asset-data-table/eds-asset-data-table.component';
import { MarkdownModule } from 'ngx-markdown';
import { EdsInstanceScheduleComponent } from './eds-instance/eds-instance-card-list/eds-instance-schedule/eds-instance-schedule.component';
import { EdsAssetIndexDataTableComponent } from './eds-instance/eds-asset/eds-asset-data-table/eds-asset-index-data-table/eds-asset-index-data-table.component';
import { EdsTemplateComponent } from './eds-template/eds-template.component';
import { KubernetesResourcesTemplateDataTableComponent } from './eds-template/kubernetes-resources-template-data-table/kubernetes-resources-template-data-table.component';
import { KubernetesResourceTemplateEditorComponent } from './eds-template/kubernetes-resources-template-data-table/kubernetes-resources-template-editor/kubernetes-resource-template-editor.component';
import { KubernetesResourcesMemberDataTableComponent } from './eds-template/kubernetes-resources-member-data-table/kubernetes-resources-member-data-table.component';
import { KubernetesResourcesMemberEditorComponent } from './eds-template/kubernetes-resources-member-data-table/kubernetes-resources-member-editor/kubernetes-resources-member-editor.component';
import { KubernetesResourcesDataTableComponent } from './eds-template/kubernetes-resources-data-table/kubernetes-resources-data-table.component';
import { KubernetesResourcesCreateComponent } from './eds-template/kubernetes-resources-template-data-table/kubernetes-resources-create/kubernetes-resources-create.component';
import { KubernetesResourcesTemplateCloneComponent } from './eds-template/kubernetes-resources-template-data-table/kubernetes-resources-template-clone/kubernetes-resources-template-clone.component';


@NgModule({
  declarations: [
    ExtDatasourceComponent,
    EdsInstanceComponent,
    EdsConfigComponent,
    EdsConfigDataTableComponent,
    EdsConfigEditorComponent,
    EdsInstanceEditorComponent,
    EdsInstanceCardComponent,
    EdsInstanceCardListComponent,
    EdsAssetComponent,
    EdsAssetDataTableComponent,
    EdsInstanceScheduleComponent,
    EdsAssetIndexDataTableComponent,
    EdsTemplateComponent,
    KubernetesResourcesTemplateDataTableComponent,
    KubernetesResourceTemplateEditorComponent,
    KubernetesResourcesMemberDataTableComponent,
    KubernetesResourcesMemberEditorComponent,
    KubernetesResourcesDataTableComponent,
    KubernetesResourcesCreateComponent,
    KubernetesResourcesTemplateCloneComponent,
  ],
  imports: [
    CommonModule,
    ExtDatasourceRoutingModule,
    DaGridModule,
    ButtonModule,
    DataTableModule,
    DropDownModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    SearchModule,
    SharedModule,
    MarkdownModule,
  ],
})
export class ExtDatasourceModule { }
