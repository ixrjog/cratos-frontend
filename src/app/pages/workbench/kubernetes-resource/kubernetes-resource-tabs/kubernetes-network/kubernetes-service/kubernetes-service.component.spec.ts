import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesServiceComponent } from './kubernetes-service.component';

describe('KubernetesServiceComponent', () => {
  let component: KubernetesServiceComponent;
  let fixture: ComponentFixture<KubernetesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
