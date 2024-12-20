import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesMemberDataTableComponent } from './kubernetes-resources-member-data-table.component';

describe('KubernetesResourceMemberDataTableComponent', () => {
  let component: KubernetesResourcesMemberDataTableComponent;
  let fixture: ComponentFixture<KubernetesResourcesMemberDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesMemberDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesMemberDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
