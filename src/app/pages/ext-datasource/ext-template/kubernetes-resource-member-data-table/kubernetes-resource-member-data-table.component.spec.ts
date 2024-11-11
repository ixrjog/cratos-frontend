import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceMemberDataTableComponent } from './kubernetes-resource-member-data-table.component';

describe('KubernetesResourceMemberDataTableComponent', () => {
  let component: KubernetesResourceMemberDataTableComponent;
  let fixture: ComponentFixture<KubernetesResourceMemberDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceMemberDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceMemberDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
