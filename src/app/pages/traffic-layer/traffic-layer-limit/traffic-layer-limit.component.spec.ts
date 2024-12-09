import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerLimitComponent } from './traffic-layer-limit.component';

describe('TrafficLayerLimitComponent', () => {
  let component: TrafficLayerLimitComponent;
  let fixture: ComponentFixture<TrafficLayerLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
