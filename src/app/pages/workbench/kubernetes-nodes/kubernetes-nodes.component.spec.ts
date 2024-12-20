import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesNodesComponent } from './kubernetes-nodes.component';

describe('KubernetesNodesComponent', () => {
  let component: KubernetesNodesComponent;
  let fixture: ComponentFixture<KubernetesNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesNodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
