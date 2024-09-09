import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkPlanningEditorComponent } from './global-network-planning-editor.component';

describe('GlobalNetworkPlanningEditorComponent', () => {
  let component: GlobalNetworkPlanningEditorComponent;
  let fixture: ComponentFixture<GlobalNetworkPlanningEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkPlanningEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkPlanningEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
