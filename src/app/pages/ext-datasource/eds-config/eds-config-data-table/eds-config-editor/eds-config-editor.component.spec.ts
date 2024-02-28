import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsConfigEditorComponent } from './eds-config-editor.component';

describe('EdsConfigEditorComponent', () => {
  let component: EdsConfigEditorComponent;
  let fixture: ComponentFixture<EdsConfigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsConfigEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
