import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRouteRecordTargetEditorComponent } from './traffic-layer-route-record-target-editor.component';

describe('TrafficLayerRouteRecordTargetEditorComponent', () => {
  let component: TrafficLayerRouteRecordTargetEditorComponent;
  let fixture: ComponentFixture<TrafficLayerRouteRecordTargetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRouteRecordTargetEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRouteRecordTargetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
