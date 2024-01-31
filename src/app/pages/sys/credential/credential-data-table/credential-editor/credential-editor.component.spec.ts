import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialEditorComponent } from './credential-editor.component';

describe('CredentialEditorComponent', () => {
  let component: CredentialEditorComponent;
  let fixture: ComponentFixture<CredentialEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredentialEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
