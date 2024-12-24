import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationActuatorListComponent } from './application-actuator-list/application-actuator-list.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      { path: 'list', component: ApplicationListComponent },
      { path: 'actuator-list', component: ApplicationActuatorListComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ApplicationRoutingModule {
}
