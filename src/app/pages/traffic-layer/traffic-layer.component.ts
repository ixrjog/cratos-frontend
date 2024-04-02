import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-traffic-layer',
  template: '<router-outlet></router-outlet>',
})
export class TrafficLayerComponent implements AfterViewInit {
  constructor() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
