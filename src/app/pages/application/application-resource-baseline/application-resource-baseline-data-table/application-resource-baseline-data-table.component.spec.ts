import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationResourceBaselineDataTableComponent } from './application-resource-baseline-data-table.component';

describe('ApplicationActuatorListDataTableComponent', () => {
  let component: ApplicationResourceBaselineDataTableComponent;
  let fixture: ComponentFixture<ApplicationResourceBaselineDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationResourceBaselineDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationResourceBaselineDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
