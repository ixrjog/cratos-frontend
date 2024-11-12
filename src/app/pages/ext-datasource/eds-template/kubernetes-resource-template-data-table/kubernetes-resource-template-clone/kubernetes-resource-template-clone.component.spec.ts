import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceTemplateCloneComponent } from './kubernetes-resource-template-clone.component';

describe('KubernetesResourceTemplateCloneComponent', () => {
  let component: KubernetesResourceTemplateCloneComponent;
  let fixture: ComponentFixture<KubernetesResourceTemplateCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceTemplateCloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceTemplateCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
