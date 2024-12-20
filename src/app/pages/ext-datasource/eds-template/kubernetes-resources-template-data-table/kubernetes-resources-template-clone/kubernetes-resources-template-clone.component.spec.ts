import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesTemplateCloneComponent } from './kubernetes-resources-template-clone.component';

describe('KubernetesResourceTemplateCloneComponent', () => {
  let component: KubernetesResourcesTemplateCloneComponent;
  let fixture: ComponentFixture<KubernetesResourcesTemplateCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesTemplateCloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesTemplateCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
