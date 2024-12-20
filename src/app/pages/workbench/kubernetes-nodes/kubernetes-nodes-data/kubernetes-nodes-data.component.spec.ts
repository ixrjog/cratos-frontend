import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesNodesDataComponent } from './kubernetes-nodes-data.component';

describe('KubernetesNodesDataComponent', () => {
  let component: KubernetesNodesDataComponent;
  let fixture: ComponentFixture<KubernetesNodesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesNodesDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesNodesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
