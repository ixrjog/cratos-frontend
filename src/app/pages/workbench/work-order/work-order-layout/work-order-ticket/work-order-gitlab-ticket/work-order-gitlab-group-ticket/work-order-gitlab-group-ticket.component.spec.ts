import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGitlabGroupTicketComponent } from './work-order-gitlab-group-ticket.component';

describe('WorkOrderGitlabGroupTicketComponent', () => {
  let component: WorkOrderGitlabGroupTicketComponent;
  let fixture: ComponentFixture<WorkOrderGitlabGroupTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGitlabGroupTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGitlabGroupTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
