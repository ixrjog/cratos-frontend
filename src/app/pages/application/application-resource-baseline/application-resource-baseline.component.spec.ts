import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationResourceBaselineComponent } from './application-resource-baseline.component';

describe('ApplicationActuatorListComponent', () => {
  let component: ApplicationResourceBaselineComponent;
  let fixture: ComponentFixture<ApplicationResourceBaselineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationResourceBaselineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationResourceBaselineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
