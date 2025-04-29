import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGitlabTicketComponent } from './work-order-gitlab-ticket.component';

describe('WorkOrderGitlabTicketComponent', () => {
  let component: WorkOrderGitlabTicketComponent;
  let fixture: ComponentFixture<WorkOrderGitlabTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGitlabTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGitlabTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
