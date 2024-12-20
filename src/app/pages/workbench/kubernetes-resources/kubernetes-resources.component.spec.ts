import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesComponent } from './kubernetes-resources.component';

describe('KubernetesWorkloadComponent', () => {
  let component: KubernetesResourcesComponent;
  let fixture: ComponentFixture<KubernetesResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
