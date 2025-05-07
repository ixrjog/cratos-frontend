import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentElasticScalingComponent } from './deployment-elastic-scaling.component';

describe('DeploymentElasticScalingComponent', () => {
  let component: DeploymentElasticScalingComponent;
  let fixture: ComponentFixture<DeploymentElasticScalingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentElasticScalingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentElasticScalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
