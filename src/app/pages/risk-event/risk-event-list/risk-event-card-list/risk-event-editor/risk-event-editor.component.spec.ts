import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventEditorComponent } from './risk-event-editor.component';

describe('RiskEventEditorComponent', () => {
  let component: RiskEventEditorComponent;
  let fixture: ComponentFixture<RiskEventEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
