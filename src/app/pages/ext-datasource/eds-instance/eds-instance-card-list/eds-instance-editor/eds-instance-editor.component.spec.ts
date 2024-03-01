import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsInstanceEditorComponent } from './eds-instance-editor.component';

describe('EdsInstanceEditorComponent', () => {
  let component: EdsInstanceEditorComponent;
  let fixture: ComponentFixture<EdsInstanceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsInstanceEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsInstanceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
