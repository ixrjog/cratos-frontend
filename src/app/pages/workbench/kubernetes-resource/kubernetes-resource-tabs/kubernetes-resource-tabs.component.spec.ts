import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceTabsComponent } from './kubernetes-resource-tabs.component';

describe('KubernetesResourceTabsComponent', () => {
  let component: KubernetesResourceTabsComponent;
  let fixture: ComponentFixture<KubernetesResourceTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
