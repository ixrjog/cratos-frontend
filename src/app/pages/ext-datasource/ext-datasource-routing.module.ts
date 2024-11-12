import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtDatasourceComponent } from './ext-datasource.component';
import { EdsConfigComponent } from './eds-config/eds-config.component';
import { EdsInstanceComponent } from './eds-instance/eds-instance.component';
import { EdsAssetComponent } from './eds-instance/eds-asset/eds-asset.component';
import { EdsTemplateComponent } from './eds-template/eds-template.component';

const routes: Routes = [
  {
    path: '',
    component: ExtDatasourceComponent,
    children: [
      { path: 'instance', component: EdsInstanceComponent },
      { path: 'config', component: EdsConfigComponent },
      { path: 'asset', component: EdsAssetComponent },
      { path: 'template', component: EdsTemplateComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ExtDatasourceRoutingModule {
}
