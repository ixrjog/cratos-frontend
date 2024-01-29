import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTagEditorComponent } from './business-tag-editor.component';

describe('BusinessTagEditorComponent', () => {
  let component: BusinessTagEditorComponent;
  let fixture: ComponentFixture<BusinessTagEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTagEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
