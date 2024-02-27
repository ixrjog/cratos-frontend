import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacGroupEditorComponent } from './rbac-group-editor.component';

describe('RbacGroupEditorComponent', () => {
  let component: RbacGroupEditorComponent;
  let fixture: ComponentFixture<RbacGroupEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacGroupEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacGroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
