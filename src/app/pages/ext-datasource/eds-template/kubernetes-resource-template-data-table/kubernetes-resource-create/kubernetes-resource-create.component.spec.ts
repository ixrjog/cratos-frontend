import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceCreateComponent } from './kubernetes-resource-create.component';

describe('KubernetesResourceCreateComponent', () => {
  let component: KubernetesResourceCreateComponent;
  let fixture: ComponentFixture<KubernetesResourceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
