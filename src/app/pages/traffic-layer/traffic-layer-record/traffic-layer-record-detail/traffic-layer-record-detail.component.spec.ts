import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRecordDetailComponent } from './traffic-layer-record-detail.component';

describe('TrafficLayerRecordGraphComponent', () => {
  let component: TrafficLayerRecordDetailComponent;
  let fixture: ComponentFixture<TrafficLayerRecordDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRecordDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
