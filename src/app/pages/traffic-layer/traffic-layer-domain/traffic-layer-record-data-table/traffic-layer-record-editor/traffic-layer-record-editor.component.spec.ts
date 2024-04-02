import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRecordEditorComponent } from './traffic-layer-record-editor.component';

describe('TrafficLayerRecordEditorComponent', () => {
  let component: TrafficLayerRecordEditorComponent;
  let fixture: ComponentFixture<TrafficLayerRecordEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRecordEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRecordEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
