import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesPodExecComponent } from './kubernetes-pod-exec.component';

describe('KubernetesPodExecComponent', () => {
  let component: KubernetesPodExecComponent;
  let fixture: ComponentFixture<KubernetesPodExecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesPodExecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesPodExecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
