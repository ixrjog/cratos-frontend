import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationActuatorListComponent } from './application-actuator-list.component';

describe('ApplicationActuatorListComponent', () => {
  let component: ApplicationActuatorListComponent;
  let fixture: ComponentFixture<ApplicationActuatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationActuatorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationActuatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
