import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationActuatorListDataTableComponent } from './application-actuator-list-data-table.component';

describe('ApplicationActuatorListDataTableComponent', () => {
  let component: ApplicationActuatorListDataTableComponent;
  let fixture: ComponentFixture<ApplicationActuatorListDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationActuatorListDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationActuatorListDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
