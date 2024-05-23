import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SampleComponent } from './sample/sample.component';
import { GettingStartedComponent } from './getting-started.component';
import { WebsocketTestComponent } from './websocket-test/websocket-test.component';

const routes: Routes = [
  {
    path: '',
    component: GettingStartedComponent,
    children: [
      { path: 'sample', component: SampleComponent },
      { path: 'ws', component: WebsocketTestComponent },
      { path: '', redirectTo: 'sample', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GettingStartedRoutingModule {}
