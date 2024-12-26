import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesContainerProbeComponent } from './kubernetes-container-probe.component';

describe('KubernetesContainerProbeComponent', () => {
  let component: KubernetesContainerProbeComponent;
  let fixture: ComponentFixture<KubernetesContainerProbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesContainerProbeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesContainerProbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
