import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesDataTableComponent } from './kubernetes-resources-data-table.component';

describe('KubernetesResourceDataTableComponent', () => {
  let component: KubernetesResourcesDataTableComponent;
  let fixture: ComponentFixture<KubernetesResourcesDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
