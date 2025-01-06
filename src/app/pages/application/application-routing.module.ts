import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import {
  ApplicationResourceBaselineComponent,
} from './application-resource-baseline/application-resource-baseline.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      { path: 'list', component: ApplicationListComponent },
      { path: 'resource-baseline', component: ApplicationResourceBaselineComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ApplicationRoutingModule {
}
