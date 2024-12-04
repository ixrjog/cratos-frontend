import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesNetworkComponent } from './kubernetes-network.component';

describe('KubernetesNetworkComponent', () => {
  let component: KubernetesNetworkComponent;
  let fixture: ComponentFixture<KubernetesNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesNetworkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
