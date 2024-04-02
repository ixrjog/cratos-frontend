import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRecordComponent } from './traffic-layer-record.component';

describe('TrafficLayerRecordComponent', () => {
  let component: TrafficLayerRecordComponent;
  let fixture: ComponentFixture<TrafficLayerRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
