import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateDataTableComponent } from './notification-template-data-table.component';

describe('NotificationTemplateDataTableComponent', () => {
  let component: NotificationTemplateDataTableComponent;
  let fixture: ComponentFixture<NotificationTemplateDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationTemplateDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
