import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateEditorComponent } from './notification-template-editor.component';

describe('NotificationTemplateEditorComponent', () => {
  let component: NotificationTemplateEditorComponent;
  let fixture: ComponentFixture<NotificationTemplateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationTemplateEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
