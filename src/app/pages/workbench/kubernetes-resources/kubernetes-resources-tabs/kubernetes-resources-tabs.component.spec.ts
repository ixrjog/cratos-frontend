import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesTabsComponent } from './kubernetes-resources-tabs.component';

describe('KubernetesResourceTabsComponent', () => {
  let component: KubernetesResourcesTabsComponent;
  let fixture: ComponentFixture<KubernetesResourcesTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
