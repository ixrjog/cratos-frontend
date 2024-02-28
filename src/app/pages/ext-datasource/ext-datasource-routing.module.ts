import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtDatasourceComponent } from './ext-datasource.component';
import { EdsConfigComponent } from './eds-config/eds-config.component';
import { EdsInstanceComponent } from './eds-instance/eds-instance.component';

const routes: Routes = [
  {
    path: '',
    component: ExtDatasourceComponent,
    children: [
      { path: 'instance', component: EdsInstanceComponent },
      { path: 'config', component: EdsConfigComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ExtDatasourceRoutingModule {
}
