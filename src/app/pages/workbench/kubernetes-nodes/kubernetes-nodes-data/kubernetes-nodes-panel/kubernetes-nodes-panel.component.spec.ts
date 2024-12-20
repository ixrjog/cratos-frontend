import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesNodesPanelComponent } from './kubernetes-nodes-panel.component';

describe('KubernetesNodesPanelComponent', () => {
  let component: KubernetesNodesPanelComponent;
  let fixture: ComponentFixture<KubernetesNodesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesNodesPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesNodesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
