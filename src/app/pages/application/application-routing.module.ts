import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { ApplicationListComponent } from './application-list/application-list.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      { path: 'list', component: ApplicationListComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ApplicationRoutingModule {
}
