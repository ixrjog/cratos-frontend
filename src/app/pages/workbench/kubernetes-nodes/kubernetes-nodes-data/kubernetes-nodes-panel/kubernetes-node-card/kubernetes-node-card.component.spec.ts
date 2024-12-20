import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesNodeCardComponent } from './kubernetes-node-card.component';

describe('KubernetesNodeCardComponent', () => {
  let component: KubernetesNodeCardComponent;
  let fixture: ComponentFixture<KubernetesNodeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesNodeCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesNodeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
