import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinopsComponent } from './finops.component';
import { FinopsAppCostComponent } from './finops-app-cost/finops-app-cost.component';

const routes: Routes = [
  {
    path: '',
    component: FinopsComponent,
    children: [
      { path: 'app-cost', component: FinopsAppCostComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class FinopsRoutingModule {
}
