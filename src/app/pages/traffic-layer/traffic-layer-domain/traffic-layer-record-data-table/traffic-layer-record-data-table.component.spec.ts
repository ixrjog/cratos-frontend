import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRecordDataTableComponent } from './traffic-layer-record-data-table.component';

describe('TrafficLayerRecordDataTableComponent', () => {
  let component: TrafficLayerRecordDataTableComponent;
  let fixture: ComponentFixture<TrafficLayerRecordDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRecordDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRecordDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
