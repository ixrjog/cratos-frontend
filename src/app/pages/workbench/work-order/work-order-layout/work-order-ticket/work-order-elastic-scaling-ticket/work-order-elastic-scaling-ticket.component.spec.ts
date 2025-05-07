import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderElasticScalingTicketComponent } from './work-order-elastic-scaling-ticket.component';

describe('WorkOrderApplicationElasticScalingTicketComponent', () => {
  let component: WorkOrderElasticScalingTicketComponent;
  let fixture: ComponentFixture<WorkOrderElasticScalingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderElasticScalingTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderElasticScalingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
