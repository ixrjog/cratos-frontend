import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationElasticScalingComponent } from './application-elastic-scaling.component';

describe('ApplicationElasticScalingComponent', () => {
  let component: ApplicationElasticScalingComponent;
  let fixture: ComponentFixture<ApplicationElasticScalingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationElasticScalingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationElasticScalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
