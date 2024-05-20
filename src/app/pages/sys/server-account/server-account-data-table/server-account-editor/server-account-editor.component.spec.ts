import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerAccountEditorComponent } from './server-account-editor.component';

describe('ServerAccountEditorComponent', () => {
  let component: ServerAccountEditorComponent;
  let fixture: ComponentFixture<ServerAccountEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerAccountEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
