import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesPodLogsComponent } from './kubernetes-pod-logs.component';

describe('KubernetesPodLogsComponent', () => {
  let component: KubernetesPodLogsComponent;
  let fixture: ComponentFixture<KubernetesPodLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesPodLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesPodLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
