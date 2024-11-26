import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesWorkloadComponent } from './kubernetes-workload.component';

describe('KubernetesWorkloadComponent', () => {
  let component: KubernetesWorkloadComponent;
  let fixture: ComponentFixture<KubernetesWorkloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesWorkloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesWorkloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
