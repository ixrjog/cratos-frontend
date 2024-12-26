import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesContainerLifecycleComponent } from './kubernetes-container-lifecycle.component';

describe('KubernetesContainerLifecycleComponent', () => {
  let component: KubernetesContainerLifecycleComponent;
  let fixture: ComponentFixture<KubernetesContainerLifecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesContainerLifecycleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesContainerLifecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
