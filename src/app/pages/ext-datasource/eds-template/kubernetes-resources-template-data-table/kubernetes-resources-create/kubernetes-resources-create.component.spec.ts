import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesCreateComponent } from './kubernetes-resources-create.component';

describe('KubernetesResourceCreateComponent', () => {
  let component: KubernetesResourcesCreateComponent;
  let fixture: ComponentFixture<KubernetesResourcesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
