import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceDataTableComponent } from './kubernetes-resource-data-table.component';

describe('KubernetesResourceDataTableComponent', () => {
  let component: KubernetesResourceDataTableComponent;
  let fixture: ComponentFixture<KubernetesResourceDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
