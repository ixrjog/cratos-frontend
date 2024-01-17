import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/@shared/shared.module';
import { SampleComponent } from './sample/sample.component';
import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';
import { BasicFormModule } from './sample/basic-form/basic-form.module';

@NgModule({
  declarations: [GettingStartedComponent, SampleComponent],
  imports: [SharedModule, GettingStartedRoutingModule, BasicFormModule],
  providers: [],
})
export class GettingStartedModule {}
