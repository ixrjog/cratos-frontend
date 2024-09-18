import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotEditorComponent } from './robot-editor.component';

describe('RobotEditorComponent', () => {
  let component: RobotEditorComponent;
  let fixture: ComponentFixture<RobotEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
