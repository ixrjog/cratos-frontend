import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceComponent } from './kubernetes-resource.component';

describe('KubernetesWorkloadComponent', () => {
  let component: KubernetesResourceComponent;
  let fixture: ComponentFixture<KubernetesResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
