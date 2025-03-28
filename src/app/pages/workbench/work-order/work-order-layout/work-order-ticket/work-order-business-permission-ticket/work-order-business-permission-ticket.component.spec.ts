import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderBusinessPermissionTicketComponent } from './work-order-business-permission-ticket.component';

describe('WorkOrderBusinessPermissionTicketComponent', () => {
  let component: WorkOrderBusinessPermissionTicketComponent;
  let fixture: ComponentFixture<WorkOrderBusinessPermissionTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderBusinessPermissionTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderBusinessPermissionTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
