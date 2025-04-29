import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGitlabProjectTicketComponent } from './work-order-gitlab-project-ticket.component';

describe('WorkOrderGitlabProjectTicketComponent', () => {
  let component: WorkOrderGitlabProjectTicketComponent;
  let fixture: ComponentFixture<WorkOrderGitlabProjectTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGitlabProjectTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGitlabProjectTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
